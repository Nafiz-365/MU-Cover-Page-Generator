import React from 'react';
import { useCoverPage } from '../../context/CoverPageContext';

export default function CoverPagePreview() {
  const { mode, formData, template, font, logoDataUrl, focusInput } = useCoverPage();

  const isLab = mode === 'lab';
  const modeTitle = isLab ? 'LAB REPORT NO-' : 'ASSIGNMENT NO-';
  const topicLabel = isLab ? 'Experiment on' : 'Assignment on';

  // Format date: YYYY-MM-DD -> 13 September 2026
  let displayDate = formData.submissionDate || '';
  if (displayDate) {
    const d = new Date(displayDate);
    if (!isNaN(d.getTime())) {
      displayDate = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }

  const teacherDept = formData.teacherDept
    ? `Department of ${formData.teacherDept}`
    : 'Department of ...';

  const studentDept = formData.studentDept
    ? `Department of ${formData.studentDept}`
    : 'Department of ...';

  return (
    <div
      id="capture-area"
      className={`a4-page shadow-a4 ${template} ${font}`}
    >
      {/* Header Logo */}
      <div className="preview-header">
        <img
          id="preview-logo"
          src={logoDataUrl || '/assets/logo.png'}
          alt="University Logo"
          className="preview-logo clickable-view"
          onClick={() => focusInput('logo-upload')}
          title="Click to change logo"
        />
      </div>

      {/* Mode & Title */}
      <div className="preview-title">
        <h2 id="preview-mode-title">
          {modeTitle}{' '}
          <span
            id="view-work-no"
            className="clickable-view"
            onClick={() => focusInput('work-no')}
            title="Click to edit Work No"
          >
            {formData.workNo || '...'}
          </span>
        </h2>
        <div className="assignment-on">
          <span>{topicLabel}</span>
          <div
            id="view-work-title"
            className="clickable-view"
            onClick={() => focusInput('work-title')}
            title="Click to edit Title"
          >
            {formData.workTitle || '.........................'}
          </div>
        </div>
      </div>

      {/* Course Info Box */}
      <div className="preview-course-box">
        <div className="course-row">
          <span className="label">Course Name :</span>
          <span
            id="view-course-name"
            className="value clickable-view"
            onClick={() => focusInput('course-name')}
            title="Click to edit Course Name"
          >
            {formData.courseName || '.........................'}
          </span>
        </div>
        <div className="course-row">
          <span className="label">Course Code :</span>
          <span
            id="view-course-code"
            className="value clickable-view"
            onClick={() => focusInput('course-code')}
            title="Click to edit Course Code"
          >
            {formData.courseCode || '.........................'}
          </span>
        </div>
      </div>

      {/* Footer / Submissions */}
      <div className="preview-footer">
        {/* SUBMITTED TO */}
        <div className="footer-column">
          <h3>SUBMITTED TO:</h3>
          <div className="footer-info">
            <p
              id="view-teacher-name"
              className="name clickable-view"
              onClick={() => focusInput('teacher-name')}
              title="Click to edit Teacher Name"
            >
              {formData.teacherName || "Teacher's Name"}
            </p>
            <p
              id="view-teacher-designation"
              className="designation clickable-view"
              onClick={() => focusInput('teacher-designation')}
              title="Click to edit Designation"
            >
              {formData.teacherDesignation || 'Designation'}
            </p>
            <p
              id="view-teacher-dept"
              className="dept clickable-view"
              onClick={() => focusInput('teacher-dept')}
              title="Click to edit Department"
            >
              {teacherDept}
            </p>
            <p
              id="view-university-line-to"
              className="uni clickable-view"
              onClick={() => focusInput('university-line')}
              title="Click to edit University"
            >
              {formData.universityLine || 'Metropolitan University, Sylhet'}
            </p>
          </div>
        </div>

        {/* SUBMITTED BY */}
        <div className="footer-column">
          <h3>SUBMITTED BY:</h3>
          <div className="footer-info">
            <p
              id="view-student-name"
              className="name clickable-view"
              onClick={() => focusInput('student-name')}
              title="Click to edit Student Name"
            >
              {formData.studentName || 'Student Name'}
            </p>
            <p className="id">
              ID:{' '}
              <span
                id="view-student-id"
                className="clickable-view font-semibold"
                onClick={() => focusInput('student-id')}
                title="Click to edit ID"
              >
                {formData.studentId || '.........'}
              </span>
            </p>
            <p className="batch">
              Batch:{' '}
              <span
                id="view-student-batch"
                className="clickable-view font-semibold"
                onClick={() => focusInput('student-batch')}
                title="Click to edit Batch"
              >
                {formData.studentBatch || '...'}
              </span>
            </p>
            {formData.studentSection && (
              <p className="section">
                Section:{' '}
                <span
                  id="view-student-section"
                  className="clickable-view font-semibold"
                  onClick={() => focusInput('student-section')}
                  title="Click to edit Section"
                >
                  {formData.studentSection}
                </span>
              </p>
            )}
            <p
              id="view-student-dept"
              className="dept clickable-view"
              onClick={() => focusInput('student-dept')}
              title="Click to edit Department"
            >
              {studentDept}
            </p>
            <p
              id="view-university-line-by"
              className="uni clickable-view"
              onClick={() => focusInput('university-line')}
              title="Click to edit University"
            >
              {formData.universityLine || 'Metropolitan University, Sylhet'}
            </p>
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="submission-date">
        <strong>Date of Submission:</strong>{' '}
        <span
          id="view-submission-date"
          className="clickable-view"
          onClick={() => focusInput('submission-date')}
          title="Click to edit Date"
        >
          {displayDate}
        </span>
      </div>
    </div>
  );
}
