import { beneficiary } from "../../../DB/model/beneficiary.js";

// ✅ Create beneficiary
export const createbeneficiary = async (req, res) => {
  try {
    const { 
      fullName, 
      birthDate, 
      maritalStatus, 
      childrenCount, 
      classification, 
      notes, 
      isActive 
    } = req.body;

    // التحقق من صحة البيانات المطلوبة
    if (!fullName || !birthDate || !maritalStatus || !classification) {
      return res.status(400).json({ 
        error: 'Missing required fields: fullName, birthDate, maritalStatus, classification' 
      });
    }

    // التحقق من أن تاريخ الميلاد ليس في المستقبل
    if (new Date(birthDate) > new Date()) {
      return res.status(400).json({ 
        error: 'Birth date cannot be in the future' 
      });
    }

    // إنشاء الحالة الجديدة
    const newbeneficiary = new beneficiary({
      fullName,
      birthDate,
      maritalStatus,
      childrenCount: childrenCount || 0,
      classification,
      notes,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedbeneficiary = await newbeneficiary.save();
    res.status(201).json(savedbeneficiary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Read All beneficiarys
export const getbeneficiarys = async (req, res) => {
  try {
    const { 
      classification, 
      maritalStatus, 
      isActive, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // بناء فلتر البحث
    const filter = {};
    if (classification) filter.classification = classification;
    if (maritalStatus) filter.maritalStatus = maritalStatus;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // حساب التصفح
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const beneficiarys = await beneficiary.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalbeneficiarys = await beneficiary.countDocuments(filter);
    const totalPages = Math.ceil(totalbeneficiarys / parseInt(limit));

    res.json({
      beneficiarys,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalbeneficiarys,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Read One beneficiary
export const getbeneficiaryById = async (req, res) => {
  try {
    const beneficiaryData = await beneficiary.findById(req.params.id);
    if (!beneficiaryData) {
      return res.status(404).json({ error: 'beneficiary not found' });
    }
    res.json(beneficiaryData);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid beneficiary ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update beneficiary
export const updatebeneficiary = async (req, res) => {
  try {
    const { 
      fullName, 
      birthDate, 
      maritalStatus, 
      childrenCount, 
      classification, 
      notes, 
      isActive 
    } = req.body;

    // التحقق من صحة تاريخ الميلاد إذا تم تحديثه
    if (birthDate && new Date(birthDate) > new Date()) {
      return res.status(400).json({ 
        error: 'Birth date cannot be in the future' 
      });
    }

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (birthDate !== undefined) updateData.birthDate = birthDate;
    if (maritalStatus !== undefined) updateData.maritalStatus = maritalStatus;
    if (childrenCount !== undefined) updateData.childrenCount = childrenCount;
    if (classification !== undefined) updateData.classification = classification;
    if (notes !== undefined) updateData.notes = notes;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedbeneficiary = await beneficiary.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedbeneficiary) {
      return res.status(404).json({ error: 'beneficiary not found' });
    }

    res.json(updatedbeneficiary);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid beneficiary ID format' });
    }
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete beneficiary (Soft Delete)
export const deletebeneficiary = async (req, res) => {
  try {
    const deletedbeneficiary = await beneficiary.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deletedbeneficiary) {
      return res.status(404).json({ error: 'beneficiary not found' });
    }

    res.json({ 
      message: 'beneficiary deactivated successfully',
      beneficiary: deletedbeneficiary 
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid beneficiary ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Permanently Delete beneficiary
export const permanentDeletebeneficiary = async (req, res) => {
  try {
    const deletedbeneficiary = await beneficiary.findByIdAndDelete(req.params.id);
    
    if (!deletedbeneficiary) {
      return res.status(404).json({ error: 'beneficiary not found' });
    }

    res.json({ message: 'beneficiary permanently deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid beneficiary ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Restore beneficiary
export const restorebeneficiary = async (req, res) => {
  try {
    const restoredbeneficiary = await beneficiary.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!restoredbeneficiary) {
      return res.status(404).json({ error: 'beneficiary not found' });
    }

    res.json({ 
      message: 'beneficiary restored successfully',
      beneficiary: restoredbeneficiary 
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid beneficiary ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get beneficiarys Statistics
export const getbeneficiarysStatistics = async (req, res) => {
  try {
    const totalbeneficiarys = await beneficiary.countDocuments();
    const activebeneficiarys = await beneficiary.countDocuments({ isActive: true });
    const inactivebeneficiarys = await beneficiary.countDocuments({ isActive: false });

    // إحصائيات التصنيف
    const classificationStats = await beneficiary.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$classification', count: { $sum: 1 } } }
    ]);

    // إحصائيات الحالة الاجتماعية
    const maritalStatusStats = await beneficiary.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$maritalStatus', count: { $sum: 1 } } }
    ]);

    // إحصائيات الأطفال
    const childrenStats = await beneficiary.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalChildren: { $sum: '$childrenCount' },
          avgChildren: { $avg: '$childrenCount' },
          maxChildren: { $max: '$childrenCount' }
        }
      }
    ]);

    res.json({
      totalbeneficiarys,
      activebeneficiarys,
      inactivebeneficiarys,
      classificationStats,
      maritalStatusStats,
      childrenStats: childrenStats[0] || { totalChildren: 0, avgChildren: 0, maxChildren: 0 }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Search beneficiarys
export const searchbeneficiarys = async (req, res) => {
  try {
    const { query, classification, maritalStatus, isActive = true } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchFilter = {
      isActive: isActive === 'true',
      fullName: { $regex: query, $options: 'i' }
    };

    if (classification) searchFilter.classification = classification;
    if (maritalStatus) searchFilter.maritalStatus = maritalStatus;

    const beneficiarys = await beneficiary.find(searchFilter)
      .sort({ fullName: 1 })
      .limit(20);

    res.json({
      query,
      results: beneficiarys,
      count: beneficiarys.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
