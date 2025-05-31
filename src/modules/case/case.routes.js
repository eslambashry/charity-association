import { Router } from 'express';
import {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  permanentDeleteCase,
  restoreCase,
  getCasesStatistics,
  searchCases
} from './case.controller.js';

const router = Router();

// CRUD Routes
router.post('/', createCase);                    // إنشاء حالة جديدة
router.get('/', getCases);                       // جلب جميع الحالات مع فلترة وتصفح
router.get('/statistics', getCasesStatistics);   // إحصائيات الحالات
router.get('/search', searchCases);              // البحث في الحالات
router.get('/:id', getCaseById);                 // جلب حالة واحدة
router.put('/:id', updateCase);                  // تحديث حالة
router.patch('/:id/deactivate', deleteCase);     // إلغاء تفعيل حالة (soft delete)
router.patch('/:id/restore', restoreCase);       // استعادة حالة
router.delete('/:id', permanentDeleteCase);      // حذف نهائي

export default router;
