import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit as firestoreLimit,
    Timestamp,
    updateDoc,
    doc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { aiMetricsService } from './aiMetrics.service';
import type {
    Alert,
    AlertType,
    AlertSeverity,
} from '../types/aiMetrics.types';

const ALERTS_COLLECTION = 'aiAlerts';

export class AlertSystemService {
    /**
     * Create an alert
     */
    async createAlert(
        type: AlertType,
        severity: AlertSeverity,
        message: string,
        metadata?: Record<string, any>
    ): Promise<string> {
        try {
            const alert: Omit<Alert, 'id'> = {
                type,
                severity,
                message,
                timestamp: Timestamp.now(),
                acknowledged: false,
                metadata,
            };

            const docRef = await addDoc(collection(db, ALERTS_COLLECTION), alert);
            console.log(`Alert created: ${type} - ${message}`);
            return docRef.id;
        } catch (error) {
            console.error('Error creating alert:', error);
            throw error;
        }
    }

    /**
     * Get recent alerts
     */
    async getRecentAlerts(limit: number = 50): Promise<Alert[]> {
        try {
            const q = query(
                collection(db, ALERTS_COLLECTION),
                orderBy('timestamp', 'desc'),
                firestoreLimit(limit)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Alert));
        } catch (error) {
            console.error('Error getting alerts:', error);
            return [];
        }
    }

    /**
     * Get unacknowledged alerts
     */
    async getUnacknowledgedAlerts(): Promise<Alert[]> {
        try {
            const q = query(
                collection(db, ALERTS_COLLECTION),
                where('acknowledged', '==', false),
                orderBy('timestamp', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Alert));
        } catch (error) {
            console.error('Error getting unacknowledged alerts:', error);
            return [];
        }
    }

    /**
     * Acknowledge an alert
     */
    async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
        try {
            const alertRef = doc(db, ALERTS_COLLECTION, alertId);
            await updateDoc(alertRef, {
                acknowledged: true,
                acknowledgedBy: userId,
                acknowledgedAt: Timestamp.now(),
            });
        } catch (error) {
            console.error('Error acknowledging alert:', error);
            throw error;
        }
    }

    /**
     * Check thresholds and create alerts if needed
     */
    async checkThresholds(): Promise<Alert[]> {
        const alerts: Alert[] = [];

        try {
            const summary = await aiMetricsService.getMetricsSummary('24h');

            // Check error rate
            if (summary.successRate < 90 && summary.totalRequests > 10) {
                await this.createAlert(
                    'high_error_rate',
                    'warning',
                    `Error rate is ${(100 - summary.successRate).toFixed(1)}% (threshold: 10%)`,
                    { errorRate: 100 - summary.successRate, totalRequests: summary.totalRequests }
                );
            }

            // Check response time
            if (summary.avgResponseTime > 5000) {
                await this.createAlert(
                    'slow_response',
                    'warning',
                    `Average response time is ${(summary.avgResponseTime / 1000).toFixed(2)}s (threshold: 5s)`,
                    { avgResponseTime: summary.avgResponseTime }
                );
            }

            // Check confidence scores
            if (summary.avgConfidence < 0.6 && summary.totalRequests > 5) {
                await this.createAlert(
                    'low_confidence',
                    'warning',
                    `Average confidence is ${(summary.avgConfidence * 100).toFixed(1)}% (threshold: 60%)`,
                    { avgConfidence: summary.avgConfidence }
                );
            }

            // Check rate limits
            const costBreakdown = await aiMetricsService.getCostBreakdown();
            if (costBreakdown.groq.usagePercentage > 80) {
                await this.createAlert(
                    'rate_limit_warning',
                    'warning',
                    `Groq usage at ${costBreakdown.groq.usagePercentage.toFixed(1)}% of free tier limit`,
                    { usage: costBreakdown.groq.usagePercentage }
                );
            }

            return this.getUnacknowledgedAlerts();
        } catch (error) {
            console.error('Error checking thresholds:', error);
            return alerts;
        }
    }
}

export const alertSystemService = new AlertSystemService();
