import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  metadata?: Record<string, any>;
}

const auditLogs: AuditLog[] = [];

// Create audit log entry
export const createAuditLog = async (data: {
  tenantId: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status?: 'success' | 'failed' | 'pending';
  metadata?: Record<string, any>;
}): Promise<AuditLog> => {
  const log: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    status: data.status || 'success',
    timestamp: new Date().toISOString()
  };
  
  auditLogs.push(log);
  return log;
};

// Get audit logs for tenant
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tenantId, action, resource, userId, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    let filtered = [...auditLogs];
    
    if (tenantId) filtered = filtered.filter(l => l.tenantId === tenantId);
    if (action) filtered = filtered.filter(l => l.action === action);
    if (resource) filtered = filtered.filter(l => l.resource === resource);
    if (userId) filtered = filtered.filter(l => l.userId === userId);
    
    if (startDate) {
      filtered = filtered.filter(l => new Date(l.timestamp) >= new Date(startDate as string));
    }
    if (endDate) {
      filtered = filtered.filter(l => new Date(l.timestamp) <= new Date(endDate as string));
    }
    
    const start = (Number(page) - 1) * Number(limit);
    const paged = filtered.slice(start, start + Number(limit));
    
    res.status(200).json({
      total: filtered.length,
      page: Number(page),
      limit: Number(limit),
      logs: paged
    });
  } catch (error) {
    console.error('Error getting audit logs:', error);
    res.status(500).json({ error: 'Failed to get audit logs' });
  }
});

// Get audit stats
router.get('/stats', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tenantId } = req.query;
    
    let filtered = [...auditLogs];
    if (tenantId) filtered = filtered.filter(l => l.tenantId === tenantId);
    
    const byAction = filtered.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byResource = filtered.reduce((acc, log) => {
      acc[log.resource] = (acc[log.resource] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byUser = filtered.reduce((acc, log) => {
      acc[log.userName] = (acc[log.userName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byStatus = filtered.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    res.status(200).json({
      totalLogs: filtered.length,
      byAction,
      byResource,
      byUser,
      byStatus,
      last24h: filtered.filter(l => 
        new Date(l.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length,
      last7d: filtered.filter(l => 
        new Date(l.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get audit stats' });
  }
});

// Export audit logs
router.get('/export', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tenantId, startDate, endDate, format = 'csv' } = req.query;
    
    let filtered = [...auditLogs];
    if (tenantId) filtered = filtered.filter(l => l.tenantId === tenantId);
    if (startDate) filtered = filtered.filter(l => new Date(l.timestamp) >= new Date(startDate as string));
    if (endDate) filtered = filtered.filter(l => new Date(l.timestamp) <= new Date(endDate as string));
    
    if (format === 'csv') {
      const csv = [
        'ID,Timestamp,Tenant,User,Action,Resource,ResourceID,Status,IP Address',
        ...filtered.map(l => 
          `${l.id},${l.timestamp},${l.tenantId},${l.userName},${l.action},${l.resource},${l.resourceId || ''},${l.status},${l.ipAddress || ''}`
        )
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
      res.status(200).send(csv);
    } else {
      res.status(200).json(filtered);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to export audit logs' });
  }
});

// Get specific resource history
router.get('/resource/:resource/:resourceId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resource, resourceId } = req.params;
    const { tenantId } = req.query;
    
    let filtered = auditLogs.filter(l => 
      l.resource === resource && 
      l.resourceId === resourceId
    );
    
    if (tenantId) filtered = filtered.filter(l => l.tenantId === tenantId);
    
    res.status(200).json(filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  } catch (error) {
    res.status(500).json({ error: 'Failed to get resource history' });
  }
});

export default router;