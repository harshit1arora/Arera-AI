import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  createLoanProduct,
  getLoanProduct,
  listLoanProducts,
  updateLoanProduct,
  deleteLoanProduct,
  getLoanProductFormSchema,
} from '../services/products';

const router = Router();

// Get all loan products
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const segment = req.query.segment as string | undefined;
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

    const products = await listLoanProducts(req.orgId!, {
      segment,
      isActive,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error listing loan products:', error);
    res.status(500).json({ error: 'Failed to list loan products' });
  }
});

// Get specific product
router.get('/:productId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const product = await getLoanProduct(req.orgId!, req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Loan product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error getting loan product:', error);
    res.status(500).json({ error: 'Failed to get loan product' });
  }
});

// Get product form schema
router.get('/:productId/form-schema', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const schema = await getLoanProductFormSchema(req.orgId!, req.params.productId);
    if (!schema) {
      return res.status(404).json({ error: 'Loan product not found' });
    }

    res.status(200).json(schema);
  } catch (error) {
    console.error('Error getting form schema:', error);
    res.status(500).json({ error: 'Failed to get form schema' });
  }
});

// Create new loan product
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      segment,
      description,
      minAmount,
      maxAmount,
      defaultAmount,
      minTenor,
      maxTenor,
      defaultTenor,
      rateType,
      rate,
      processingFeePercent,
      defaultProcessingFee,
      disburseType,
      defaultTranches,
      eligibilityCriteria,
      customFields,
      requiredDocuments,
    } = req.body;

    // Validate required fields
    if (!name || !segment || typeof minAmount !== 'number' || typeof maxAmount !== 'number' ||
        typeof minTenor !== 'number' || typeof maxTenor !== 'number' || !rateType || typeof rate !== 'number') {
      return res.status(400).json({
        error: 'Missing required fields: name, segment, minAmount, maxAmount, minTenor, maxTenor, rateType, rate',
      });
    }

    if (!['Micro', 'Consumer', 'MSME'].includes(segment)) {
      return res.status(400).json({ error: 'segment must be one of: Micro, Consumer, MSME' });
    }

    const productId = await createLoanProduct(req.orgId!, {
      name,
      segment,
      description,
      isActive: true,
      minAmount,
      maxAmount,
      defaultAmount: defaultAmount || minAmount,
      minTenor,
      maxTenor,
      defaultTenor: defaultTenor || minTenor,
      rateType,
      rate,
      processingFeePercent: processingFeePercent || 0,
      defaultProcessingFee: defaultProcessingFee || 0,
      disburseType: disburseType || 'full',
      defaultTranches: defaultTranches || 1,
      eligibilityCriteria: eligibilityCriteria || {},
      customFields: customFields || [],
      requiredDocuments: requiredDocuments || ['PAN', 'Aadhaar', 'Bank Statement'],
    });

    res.status(201).json({
      id: productId,
      message: 'Loan product created successfully',
    });
  } catch (error) {
    console.error('Error creating loan product:', error);
    res.status(500).json({ error: 'Failed to create loan product' });
  }
});

// Update loan product
router.put('/:productId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updates = req.body;

    await updateLoanProduct(req.orgId!, req.params.productId, updates);

    res.status(200).json({ success: true, message: 'Loan product updated' });
  } catch (error) {
    console.error('Error updating loan product:', error);
    res.status(500).json({ error: 'Failed to update loan product' });
  }
});

// Disable loan product
router.post('/:productId/disable', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await deleteLoanProduct(req.orgId!, req.params.productId);

    res.status(200).json({ success: true, message: 'Loan product disabled' });
  } catch (error) {
    console.error('Error disabling loan product:', error);
    res.status(500).json({ error: 'Failed to disable loan product' });
  }
});

export default router;
