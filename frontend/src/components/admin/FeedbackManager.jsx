'use client';

import { useEffect, useMemo, useState } from 'react';
import { reportsAPI, feedbackAPI } from '@/lib/api';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate, truncate, capitalise } from '@/utils/helpers';
import { FEEDBACK_VISIBILITIES } from '@/utils/constants';

export default function FeedbackManager() {
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({});
  const [savingId, setSavingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsRes, feedbackRes] = await Promise.all([
        reportsAPI.getAll(),
        feedbackAPI.getAll(),
      ]);
      setReports(reportsRes.data.reports || []);
      setFeedbacks(feedbackRes.data.feedbacks || []);
    } catch (err) {
      console.error('Feedback load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const feedbacksByReport = useMemo(() => {
    return feedbacks.reduce((acc, fb) => {
      if (!fb.report_id) return acc;
      acc[fb.report_id] = acc[fb.report_id] || [];
      acc[fb.report_id].push(fb);
      return acc;
    }, {});
  }, [feedbacks]);

  const handleFormChange = (reportId, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [reportId]: {
        ...prev[reportId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (reportId, event) => {
    event.preventDefault();
    const message = formState[reportId]?.message?.trim();
    const visibility = formState[reportId]?.visibility || FEEDBACK_VISIBILITIES[0];

    if (!message) {
      alert('Please enter a feedback message.');
      return;
    }

    setSavingId(reportId);
    try {
      await feedbackAPI.create({
        report_id: reportId,
        message,
        visibility,
      });
      setFormState((prev) => ({ ...prev, [reportId]: { message: '', visibility } }));
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not submit feedback.');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-400 py-6 text-center">Loading feedback queue...</p>;
  }

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No community reports yet.</p>
      ) : (
        reports.map((report) => {
          const existing = feedbacksByReport[report.id] || [];
          return (
            <div key={report.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge value={report.status} />
                    {report.source_name && (
                      <span className="text-xs text-gray-500 font-medium">ðŸ“ {report.source_name}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{truncate(report.description, 140)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Reported by <span className="font-semibold">{report.submitted_by_name || 'community'}</span> · {formatDate(report.created_at)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Recent feedback</p>
                {existing.length === 0 ? (
                  <p className="text-xs text-gray-400">No feedback recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {existing.map((fb) => (
                      <div key={fb.id} className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-sm text-gray-700">
                        <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                          <span>{fb.admin_name || 'Admin'}</span>
                          <span>{capitalise(fb.visibility)}</span>
                          <span>{formatDate(fb.created_at)}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700">{fb.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form className="space-y-2" onSubmit={(event) => handleSubmit(report.id, event)}>
                <label className="block text-xs font-semibold tracking-wide text-gray-500 uppercase">Send feedback</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-sky-400 focus:ring-sky-100 focus:outline-none"
                  placeholder="Paste a short response to share with the community."
                  value={formState[report.id]?.message || ''}
                  onChange={(event) => handleFormChange(report.id, 'message', event.target.value)}
                />
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                    value={formState[report.id]?.visibility || FEEDBACK_VISIBILITIES[0]}
                    onChange={(event) => handleFormChange(report.id, 'visibility', event.target.value)}
                  >
                    {FEEDBACK_VISIBILITIES.map((vis) => (
                      <option key={vis} value={vis}>
                        {capitalise(vis)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={savingId === report.id}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
                  >
                    {savingId === report.id ? 'Sharing…' : 'Share feedback'}
                  </button>
                </div>
              </form>
            </div>
          );
        })
      )}
    </div>
  );
}
