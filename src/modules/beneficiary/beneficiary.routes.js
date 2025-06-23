import { Router } from 'express';
import {
  createbeneficiary,
  getbeneficiarys,
  getbeneficiaryById,
  updatebeneficiary,
  deletebeneficiary,
  permanentDeletebeneficiary,
  restorebeneficiary,
  getbeneficiarysStatistics,
  searchbeneficiarys
} from './beneficiary.controller.js';

const router = Router();

// CRUD Routes
router.post('/', createbeneficiary);                    // إنشاء حالة جديدة
router.get('/', getbeneficiarys);                       // جلب جميع الحالات مع فلترة وتصفح
router.get('/statistics', getbeneficiarysStatistics);   // إحصائيات الحالات
router.get('/search', searchbeneficiarys);              // البحث في الحالات
router.get('/:id', getbeneficiaryById);                 // جلب حالة واحدة
router.put('/:id', updatebeneficiary);                  // تحديث حالة
router.patch('/:id/deactivate', deletebeneficiary);     // إلغاء تفعيل حالة (soft delete)
router.patch('/:id/restore', restorebeneficiary);       // استعادة حالة
router.delete('/:id', permanentDeletebeneficiary);      // حذف نهائي

export default router;
