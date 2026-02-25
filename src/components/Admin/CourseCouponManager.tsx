import React, { useState, useEffect } from 'react';
import { listCourseSettings } from '@/lib/firebaseCourseSettings';
import { listCourseCoupons, createCourseCoupon, deleteCourseCoupon, type CourseCoupon } from '@/lib/courseCoupons';
import type { CourseSetting } from '@/lib/firebaseCourseSettings';

interface Props {
  onNotification: (message: string, type: 'success' | 'error') => void;
}

const CourseCouponManager: React.FC<Props> = ({ onNotification }) => {
  const [courses, setCourses] = useState<CourseSetting[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [coupons, setCoupons] = useState<CourseCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const paidCourses = courses.filter((c) => c.course_id !== 'starter-pack' && !c.is_free);

  useEffect(() => {
    listCourseSettings().then((list) => setCourses(list));
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setCoupons([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    listCourseCoupons(selectedCourseId).then((list) => {
      setCoupons(list);
      setLoading(false);
    });
  }, [selectedCourseId]);

  useEffect(() => {
    if (paidCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(paidCourses[0].course_id);
    }
  }, [paidCourses, selectedCourseId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeTrim = code.trim().toUpperCase();
    if (!codeTrim || !selectedCourseId) return;
    const value = parseFloat(discountValue);
    if (isNaN(value) || value <= 0) {
      onNotification('Invalid discount value', 'error');
      return;
    }
    if (discountType === 'percent' && value > 100) {
      onNotification('Percent discount cannot exceed 100', 'error');
      return;
    }
    setSaving(true);
    try {
      await createCourseCoupon({
        course_id: selectedCourseId,
        code: codeTrim,
        discount_type: discountType,
        discount_value: value,
        max_uses: maxUses ? parseInt(maxUses, 10) : 0,
        expires_at: expiresAt || null,
      });
      onNotification('Coupon created', 'success');
      setShowForm(false);
      setCode('');
      setDiscountValue('');
      setMaxUses('');
      setExpiresAt('');
      listCourseCoupons(selectedCourseId).then(setCoupons);
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to create coupon', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Delete this coupon? It can no longer be used.')) return;
    try {
      await deleteCourseCoupon(couponId);
      onNotification('Coupon deleted', 'success');
      if (selectedCourseId) listCourseCoupons(selectedCourseId).then(setCoupons);
    } catch {
      onNotification('Failed to delete coupon', 'error');
    }
  };

  const selectedCourse = courses.find((c) => c.course_id === selectedCourseId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Coupon Codes</h2>
        <p className="text-slate-400 text-sm mt-0.5">Create and manage discount codes for paid courses.</p>
      </div>

      {paidCourses.length === 0 ? (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 text-center">
          <p className="text-slate-400">No purchasable courses yet. Add a paid course in Course Settings first.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {paidCourses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.course_id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCourseId === c.course_id ? 'bg-amber-500 text-slate-900' : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {selectedCourseId && selectedCourse && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Coupons for {selectedCourse.title}</h3>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium rounded-lg text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {showForm ? 'Cancel' : 'Create Coupon'}
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleCreate} className="mb-6 p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-1">Code *</label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="e.g. LAUNCH50"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-1">Discount Type</label>
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value as 'percent' | 'fixed')}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-1">Discount Value *</label>
                      <input
                        type="number"
                        min="0"
                        step={discountType === 'percent' ? '1' : '0.01'}
                        max={discountType === 'percent' ? '100' : undefined}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder={discountType === 'percent' ? '50' : '25'}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-1">Max Uses (0 = unlimited)</label>
                      <input
                        type="number"
                        min="0"
                        value={maxUses}
                        onChange={(e) => setMaxUses(e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 text-xs font-medium mb-1">Expires At (optional)</label>
                      <input
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium rounded-lg text-sm disabled:opacity-50">
                    {saving ? 'Creating...' : 'Create Coupon'}
                  </button>
                </form>
              )}

              {loading ? (
                <div className="py-8 text-center text-slate-400">Loading...</div>
              ) : coupons.length === 0 ? (
                <p className="text-slate-500 text-sm py-4">No coupons for this course yet.</p>
              ) : (
                <div className="space-y-2">
                  {coupons.map((cp) => (
                    <div
                      key={cp.id}
                      className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg"
                    >
                      <div>
                        <span className="font-mono font-semibold text-amber-400">{cp.code}</span>
                        <span className="text-slate-400 text-sm ml-3">
                          {cp.discount_type === 'percent' ? `${cp.discount_value}% off` : `£${cp.discount_value} off`}
                        </span>
                        <span className="text-slate-500 text-xs ml-2">
                          Used {cp.used_count}{cp.max_uses > 0 ? ` / ${cp.max_uses}` : ''}
                          {cp.expires_at && ` · Expires ${new Date(cp.expires_at).toLocaleDateString()}`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(cp.id)}
                        className="px-3 py-1.5 text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseCouponManager;
