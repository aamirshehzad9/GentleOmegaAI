/**
 * AI Blogs Studio - Professional Blog Editor
 * Rich text editor with AI content generation, SEO optimization, image upload
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AiBlogsPage } from './index';
import { useAuth } from '../../../contexts/AuthContext';
import { db, storage } from '../../../firebase/config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import BlogsHeader from './components/BlogsHeader';
import BlogsFooter from './components/BlogsFooter';
import { 
  generateBlogContent, 
  generateSEOMetadata, 
  improveContent,
  isGeminiConfigured 
} from './api/gemini';
import { useSEO } from '../../utils/seo';
import HelpTooltip from './components/HelpTooltip';

interface BlogEditorProps {
  onNavigate: (page: AiBlogsPage) => void;
}

interface BlogPost {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  category: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  status: 'draft' | 'published';
}

const BlogEditor: React.FC<BlogEditorProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const seo = useSEO();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seoAnalyzing, setSeoAnalyzing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [seoScore, setSeoScore] = useState(0);
  const [aiSeoScore, setAiSeoScore] = useState<number | null>(null);
  const [seoSuggestions, setSeoSuggestions] = useState<string[]>([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    tags: [],
    category: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    status: 'draft'
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'seo' | 'preview'>('editor');
  const [aiPrompt, setAiPrompt] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      if (post.title || post.content) {
        handleAutoSave();
      }
    }, 5000); // Auto-save every 5 seconds

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [post]);

  // Calculate metrics
  useEffect(() => {
    const words = post.content.split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);

    // Simple readability score (Flesch Reading Ease approximation)
    const sentences = post.content.split(/[.!?]+/).length;
    const syllables = post.content.split(/\s+/).reduce((acc, word) => {
      return acc + Math.max(1, word.length / 3);
    }, 0);
    
    if (words > 0 && sentences > 0) {
      const score = Math.max(0, Math.min(100, 
        206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
      ));
      setReadabilityScore(Math.round(score));
    }

    // SEO Score calculation
    let score = 0;
    if (post.seoTitle.length >= 50 && post.seoTitle.length <= 60) score += 25;
    if (post.seoDescription.length >= 150 && post.seoDescription.length <= 160) score += 25;
    if (post.seoKeywords.length >= 3) score += 20;
    if (words >= 300) score += 15;
    if (post.featuredImage) score += 15;
    setSeoScore(score);
  }, [post]);

  const handleAutoSave = async () => {
    if (!currentUser) return;
    
    try {
      const draftRef = doc(db, 'users', currentUser.uid, 'drafts', 'current');
      await setDoc(draftRef, {
        ...post,
        lastSaved: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) {
      if (!currentUser) {
        setMessage({ type: 'error', text: 'Please sign in to upload images' });
        setTimeout(() => setMessage(null), 3000);
      }
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please upload a valid image (JPG, PNG, or WebP)' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    setMessage({ type: 'success', text: 'Uploading image...' });
    
    try {
      // Create unique filename
      const timestamp = Date.now();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${cleanFileName}`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `blog-images/${currentUser.uid}/${fileName}`);
      const uploadTask = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      setPost(prev => ({ ...prev, featuredImage: downloadURL }));
      setMessage({ type: 'success', text: '✅ Image uploaded successfully!' });
    } catch (error: any) {
      console.error('Image upload error:', error);
      const errorMsg = error?.code === 'storage/unauthorized' 
        ? 'Storage permission denied. Please contact support.'
        : error?.message || 'Failed to upload image. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setMessage({ type: 'error', text: 'Please enter a prompt for AI generation' });
      return;
    }

    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      setMessage({ 
        type: 'error', 
        text: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.' 
      });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    setAiLoading(true);
    setMessage({ type: 'success', text: 'AI is generating content... This may take 30-60 seconds.' });
    
    try {
      // Generate content using Google Gemini
      const result = await generateBlogContent(aiPrompt, {
        tone: 'professional',
        wordCount: 2000,
        model: 'PRO'
      });

      if (!result.success) {
        throw new Error(result.error || 'AI generation failed');
      }

      // Update post with AI-generated content
      setPost(prev => ({
        ...prev,
        content: prev.content ? prev.content + '\n\n' + result.content : result.content,
        title: prev.title || aiPrompt.substring(0, 100),
        excerpt: prev.excerpt || result.content.substring(0, 150) + '...'
      }));

      // Auto-generate SEO metadata if content is substantial
      if (result.content.length > 500) {
        const seoResult = await generateSEOMetadata(result.content);
        if (seoResult.success) {
          setPost(prev => ({
            ...prev,
            seoTitle: seoResult.seoTitle,
            seoDescription: seoResult.seoDescription,
            seoKeywords: seoResult.keywords
          }));
        }
      }
      
      setMessage({ 
        type: 'success', 
        text: `AI generated ${result.tokensUsed?.toLocaleString() || '~'} tokens. Content added successfully!` 
      });
      setAiPrompt('');
    } catch (error: any) {
      console.error('AI generation error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'AI generation failed. Please try again.' 
      });
    } finally {
      setAiLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleImproveContent = async () => {
    if (!post.content) {
      setMessage({ type: 'error', text: 'No content to improve' });
      return;
    }

    if (!isGeminiConfigured()) {
      setMessage({ type: 'error', text: 'Gemini API key not configured' });
      return;
    }

    setAiLoading(true);
    setMessage({ type: 'success', text: 'AI is improving your content...' });

    try {
      const result = await improveContent(post.content, [
        'Improve readability and flow',
        'Add engaging transitions',
        'Enhance SEO with natural keywords',
        'Make it more professional'
      ]);

      if (result.success) {
        setPost(prev => ({ ...prev, content: result.content }));
        setMessage({ type: 'success', text: 'Content improved successfully!' });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to improve content' });
    } finally {
      setAiLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleGenerateSEO = async () => {
    if (!post.content) {
      setMessage({ type: 'error', text: 'Add content first to generate SEO' });
      return;
    }

    if (!isGeminiConfigured()) {
      setMessage({ type: 'error', text: 'Gemini API key not configured' });
      return;
    }

    setLoading(true);
    setSeoAnalyzing(true);
    try {
      // Use advanced SEO engine for better analysis
      const primaryKeyword = post.title || post.seoKeywords[0] || 'blog post';
      
      // Get AI-powered SEO score
      const quickScore = await seo.quickScore(post.content, primaryKeyword);
      setAiSeoScore(quickScore);
      
      // Get optimization suggestions
      const analysis = await seo.analyzeContentQuality({
        content: post.content,
        targetKeyword: primaryKeyword,
      });
      
      // Extract top priority suggestions
      const topSuggestions = analysis.suggestions
        .filter(s => s.priority === 'high')
        .slice(0, 5)
        .map(s => s.message);
      setSeoSuggestions(topSuggestions);
      
      // Fallback to legacy SEO generation
      const result = await generateSEOMetadata(post.content);
      
      if (result.success) {
        setPost(prev => ({
          ...prev,
          seoTitle: result.seoTitle,
          seoDescription: result.seoDescription,
          seoKeywords: result.keywords
        }));
        setMessage({ type: 'success', text: `SEO metadata generated! AI Score: ${quickScore}/100` });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to generate SEO' });
    } finally {
      setLoading(false);
      setSeoAnalyzing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePublish = async () => {
    if (!currentUser) return;
    
    if (!post.title || !post.content) {
      setMessage({ type: 'error', text: 'Please add title and content' });
      return;
    }

    setSaving(true);
    try {
      const postRef = doc(db, 'users', currentUser.uid, 'posts', Date.now().toString());
      await setDoc(postRef, {
        ...post,
        status: 'published',
        publishedAt: serverTimestamp(),
        author: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        }
      });

      setMessage({ type: 'success', text: 'Blog published successfully!' });
      setTimeout(() => onNavigate('dashboard'), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to publish. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentUser) return;
    
    setSaving(true);
    try {
      const draftRef = doc(db, 'users', currentUser.uid, 'drafts', Date.now().toString());
      await setDoc(draftRef, {
        ...post,
        status: 'draft',
        savedAt: serverTimestamp()
      });

      setMessage({ type: 'success', text: 'Draft saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save draft' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getReadabilityColor = () => {
    if (readabilityScore >= 60) return 'text-green-400';
    if (readabilityScore >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSEOColor = () => {
    if (seoScore >= 80) return 'text-green-400';
    if (seoScore >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      <BlogsHeader context="user" onNavigate={onNavigate} currentPage="editor" showBackButton={true} />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">✍️ Blog Editor</h1>
              <HelpTooltip 
                content="Use AI to generate content, optimize for SEO, and track your writing metrics in real-time."
                learnMoreLink="https://github.com/GentleOmegaAI/GentleOmegaAI/blob/main/docs/USER_GUIDE.md#creating-your-first-blog"
              />
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-[#A8B2D1] flex items-center gap-1">
                Words: <span className="text-white font-semibold">{wordCount}</span>
                <HelpTooltip size="sm" content="Aim for 1,500-2,500 words for SEO-optimized long-form content" />
              </span>
              <span className="text-[#A8B2D1] flex items-center gap-1">
                Readability: <span className={`font-semibold ${getReadabilityColor()}`}>{readabilityScore}/100</span>
                <HelpTooltip size="sm" content="Target 60-80/100. Higher scores mean easier to read. Use shorter sentences and simpler words." />
              </span>
              <span className="text-[#A8B2D1] flex items-center gap-1">
                SEO: <span className={`font-semibold ${getSEOColor()}`}>{seoScore}/100</span>
                <HelpTooltip size="sm" content="Target 70-90/100. Check SEO tab for detailed optimization suggestions." />
              </span>
              <span className="text-[#A8B2D1] text-xs italic">Auto-saving...</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving || !post.title || !post.content}
              className="px-6 py-2 bg-[#F7B731] text-white rounded-lg hover:bg-[#F39C12] transition-colors disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'editor' ? 'text-[#F7B731] border-b-2 border-[#F7B731]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'seo' ? 'text-[#F7B731] border-b-2 border-[#F7B731]' : 'text-gray-400 hover:text-white'
            }`}
          >
            SEO
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'preview' ? 'text-[#F7B731] border-b-2 border-[#F7B731]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor Area */}
          <div className="lg:col-span-2">
            {activeTab === 'editor' && (
              <div className="space-y-6">
                {/* Title */}
                <input
                  type="text"
                  placeholder="Enter your blog title..."
                  value={post.title}
                  onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#1A1F3A] border border-gray-700 rounded-lg text-white text-2xl font-bold focus:outline-none focus:border-[#F7B731]"
                />

                {/* Featured Image */}
                <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-4">
                  <label className="block text-white font-semibold mb-2">Featured Image</label>
                  {post.featuredImage ? (
                    <div className="relative">
                      <img src={post.featuredImage} alt="Featured" className="w-full h-64 object-cover rounded-lg" />
                      <button
                        onClick={() => setPost(prev => ({ ...prev, featuredImage: '' }))}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-[#F7B731] transition-colors">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-400">Click to upload or drag and drop</span>
                      <span className="text-gray-500 text-sm">PNG, JPG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Content Editor */}
                <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white font-semibold">Content</label>
                    <button
                      onClick={handleImproveContent}
                      disabled={aiLoading || !post.content}
                      className="px-3 py-1 bg-[#5F27CD] text-white text-sm rounded hover:bg-[#4A1FA8] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {aiLoading ? '🤖 Improving...' : '✨ Improve with AI'}
                    </button>
                  </div>
                  <textarea
                    ref={contentRef}
                    placeholder="Start writing your blog content..."
                    value={post.content}
                    onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full h-[500px] px-4 py-3 bg-[#0A0E27] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F7B731] resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-4">
                  <label className="block text-white font-semibold mb-2">Tags</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1 px-3 py-2 bg-[#0A0E27] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F7B731]"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-[#F7B731] text-white rounded-lg hover:bg-[#F39C12]"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#F7B731]/20 text-[#F7B731] rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                {/* Auto-generate SEO button */}
                <button
                  onClick={handleGenerateSEO}
                  disabled={loading || !post.content}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#F7B731] to-[#F39C12] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Generating SEO...
                    </>
                  ) : (
                    <>
                      ✨ Auto-Generate SEO with AI
                    </>
                  )}
                </button>

                <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-4">
                  <label className="block text-white font-semibold mb-2">SEO Title</label>
                  <input
                    type="text"
                    placeholder="Optimized title for search engines..."
                    value={post.seoTitle}
                    onChange={(e) => setPost(prev => ({ ...prev, seoTitle: e.target.value }))}
                    maxLength={60}
                    className="w-full px-3 py-2 bg-[#0A0E27] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F7B731]"
                  />
                  <p className="text-sm text-gray-400 mt-1">{post.seoTitle.length}/60 characters</p>
                </div>

                <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-4">
                  <label className="block text-white font-semibold mb-2">Meta Description</label>
                  <textarea
                    placeholder="Brief description for search results..."
                    value={post.seoDescription}
                    onChange={(e) => setPost(prev => ({ ...prev, seoDescription: e.target.value }))}
                    maxLength={160}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#0A0E27] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F7B731] resize-none"
                  />
                  <p className="text-sm text-gray-400 mt-1">{post.seoDescription.length}/160 characters</p>
                </div>

                <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-4">
                  <label className="block text-white font-semibold mb-2">Focus Keywords (comma separated)</label>
                  <input
                    type="text"
                    placeholder="keyword1, keyword2, keyword3"
                    value={post.seoKeywords.join(', ')}
                    onChange={(e) => setPost(prev => ({ 
                      ...prev, 
                      seoKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                    }))}
                    className="w-full px-3 py-2 bg-[#0A0E27] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F7B731]"
                  />
                </div>

                <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">SEO Checklist</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={post.seoTitle.length >= 50 && post.seoTitle.length <= 60 ? 'text-green-400' : 'text-gray-400'}>
                        {post.seoTitle.length >= 50 && post.seoTitle.length <= 60 ? '✓' : '○'}
                      </span>
                      <span className="text-gray-300">SEO Title (50-60 chars)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={post.seoDescription.length >= 150 && post.seoDescription.length <= 160 ? 'text-green-400' : 'text-gray-400'}>
                        {post.seoDescription.length >= 150 && post.seoDescription.length <= 160 ? '✓' : '○'}
                      </span>
                      <span className="text-gray-300">Meta Description (150-160 chars)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={post.seoKeywords.length >= 3 ? 'text-green-400' : 'text-gray-400'}>
                        {post.seoKeywords.length >= 3 ? '✓' : '○'}
                      </span>
                      <span className="text-gray-300">At least 3 keywords</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={wordCount >= 300 ? 'text-green-400' : 'text-gray-400'}>
                        {wordCount >= 300 ? '✓' : '○'}
                      </span>
                      <span className="text-gray-300">Minimum 300 words</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={post.featuredImage ? 'text-green-400' : 'text-gray-400'}>
                        {post.featuredImage ? '✓' : '○'}
                      </span>
                      <span className="text-gray-300">Featured image added</span>
                    </div>
                  </div>
                </div>

                {/* AI SEO Score */}
                {aiSeoScore !== null && (
                  <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">🤖 AI SEO Analysis</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">Score:</span>
                        <span className={`text-2xl font-bold ${
                          aiSeoScore >= 85 ? 'text-green-400' :
                          aiSeoScore >= 70 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {aiSeoScore}/100
                        </span>
                      </div>
                    </div>
                    {seoSuggestions.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Top Improvements:</div>
                        <ul className="space-y-2">
                          {seoSuggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start">
                              <span className="text-purple-400 mr-2">→</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-8">
                <h1 className="text-4xl font-bold text-white mb-4">{post.title || 'Untitled Blog Post'}</h1>
                {post.featuredImage && (
                  <img src={post.featuredImage} alt="Featured" className="w-full h-96 object-cover rounded-lg mb-6" />
                )}
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap">{post.content || 'No content yet...'}</p>
                </div>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-[#F7B731]/20 text-[#F7B731] rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Assistant Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI Assistant
              </h3>
              <textarea
                placeholder="Describe what you want to write about..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-[#0A0E27] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F7B731] resize-none mb-3"
              />
              <button
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiPrompt.trim()}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#F7B731] to-[#F39C12] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {aiLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Content'
                )}
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">Powered by Google Gemini AI</p>
            </div>

            <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setPost(prev => ({ ...prev, category: 'Technology' }))}
                  className="w-full px-3 py-2 bg-[#0A0E27] text-gray-300 rounded-lg hover:bg-[#F7B731]/20 hover:text-[#F7B731] transition-colors text-left"
                >
                  📱 Technology
                </button>
                <button
                  onClick={() => setPost(prev => ({ ...prev, category: 'Business' }))}
                  className="w-full px-3 py-2 bg-[#0A0E27] text-gray-300 rounded-lg hover:bg-[#F7B731]/20 hover:text-[#F7B731] transition-colors text-left"
                >
                  💼 Business
                </button>
                <button
                  onClick={() => setPost(prev => ({ ...prev, category: 'Lifestyle' }))}
                  className="w-full px-3 py-2 bg-[#0A0E27] text-gray-300 rounded-lg hover:bg-[#F7B731]/20 hover:text-[#F7B731] transition-colors text-left"
                >
                  ✨ Lifestyle
                </button>
                <button
                  onClick={() => setPost(prev => ({ ...prev, category: 'Health' }))}
                  className="w-full px-3 py-2 bg-[#0A0E27] text-gray-300 rounded-lg hover:bg-[#F7B731]/20 hover:text-[#F7B731] transition-colors text-left"
                >
                  🏥 Health
                </button>
              </div>
            </div>

            <div className="bg-[#1A1F3A] border border-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Aim for 300+ words for better SEO</li>
                <li>• Use headings to structure content</li>
                <li>• Add relevant keywords naturally</li>
                <li>• Include a featured image</li>
                <li>• Write compelling meta description</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <BlogsFooter />
    </div>
  );
};

export default BlogEditor;