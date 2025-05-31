import { Case } from "../../../DB/model/case.js";

// ✅ Create Case
export const createCase = async (req, res) => {
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
    const newCase = new Case({
      fullName,
      birthDate,
      maritalStatus,
      childrenCount: childrenCount || 0,
      classification,
      notes,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Read All Cases
export const getCases = async (req, res) => {
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

    const cases = await Case.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCases = await Case.countDocuments(filter);
    const totalPages = Math.ceil(totalCases / parseInt(limit));

    res.json({
      cases,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCases,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Read One Case
export const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(caseData);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid case ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Case
export const updateCase = async (req, res) => {
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

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json(updatedCase);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid case ID format' });
    }
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Case (Soft Delete)
export const deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deletedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ 
      message: 'Case deactivated successfully',
      case: deletedCase 
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid case ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Permanently Delete Case
export const permanentDeleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    
    if (!deletedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ message: 'Case permanently deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid case ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Restore Case
export const restoreCase = async (req, res) => {
  try {
    const restoredCase = await Case.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!restoredCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ 
      message: 'Case restored successfully',
      case: restoredCase 
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid case ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Cases Statistics
export const getCasesStatistics = async (req, res) => {
  try {
    const totalCases = await Case.countDocuments();
    const activeCases = await Case.countDocuments({ isActive: true });
    const inactiveCases = await Case.countDocuments({ isActive: false });

    // إحصائيات التصنيف
    const classificationStats = await Case.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$classification', count: { $sum: 1 } } }
    ]);

    // إحصائيات الحالة الاجتماعية
    const maritalStatusStats = await Case.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$maritalStatus', count: { $sum: 1 } } }
    ]);

    // إحصائيات الأطفال
    const childrenStats = await Case.aggregate([
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
      totalCases,
      activeCases,
      inactiveCases,
      classificationStats,
      maritalStatusStats,
      childrenStats: childrenStats[0] || { totalChildren: 0, avgChildren: 0, maxChildren: 0 }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Search Cases
export const searchCases = async (req, res) => {
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

    const cases = await Case.find(searchFilter)
      .sort({ fullName: 1 })
      .limit(20);

    res.json({
      query,
      results: cases,
      count: cases.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
