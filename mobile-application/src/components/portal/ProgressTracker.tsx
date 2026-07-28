// src/components/portal/ProgressTracker.tsx
"use client";

import type { VisaStage } from "@/types/applicant";

interface ProgressTrackerProps {
  stages: VisaStage[];
  currentStageId?: string;
  showLabels?: boolean;
  orientation?: "horizontal" | "vertical";
  compact?: boolean;
}

const STAGE_ICONS: Record<string, string> = {
  pending: "○",
  in_progress: "◐",
  completed: "●",
  skipped: "⊘",
};

export function ProgressTracker({
  stages,
  currentStageId,
  showLabels = true,
  orientation = "vertical",
  compact = false,
}: ProgressTrackerProps) {
  const completedCount = stages.filter((s) => s.status === "completed").length;
  const progressPercent =
    stages.length > 0 ? (completedCount / stages.length) * 100 : 0;

  if (orientation === "horizontal") {
    return (
      <div className="progress-tracker progress-tracker--horizontal">
        <div className="progress-tracker__bar">
          <div
            className="progress-tracker__fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="progress-tracker__stages">
          {stages.map((stage, index) => {
            const isCurrent = stage.id === currentStageId;
            const isCompleted = stage.status === "completed";
            const isSkipped = stage.status === "skipped";
            const isPending = stage.status === "pending";
            const isActive = stage.status === "in_progress";

            let stageClass = "progress-stage";
            if (isCompleted) stageClass += " progress-stage--completed";
            if (isActive) stageClass += " progress-stage--active";
            if (isCurrent) stageClass += " progress-stage--current";
            if (isSkipped) stageClass += " progress-stage--skipped";
            if (isPending && !isCurrent) stageClass += " progress-stage--pending";

            return (
              <div key={stage.id} className={stageClass}>
                <div className="progress-stage__circle">
                  {STAGE_ICONS[stage.status] || stage.id}
                </div>
                {showLabels && (
                  <div className="progress-stage__label">
                    {stage.title}
                    {stage.estimatedDays && !compact && (
                      <span className="progress-stage__eta">
                        ~{stage.estimatedDays}d
                      </span>
                    )}
                  </div>
                )}
                {index < stages.length - 1 && (
                  <div className="progress-stage__connector" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="progress-tracker progress-tracker--vertical">
      <div className="progress-tracker__summary">
        <span className="progress-tracker__count">
          {completedCount} of {stages.length} stages complete
        </span>
        <span className="progress-tracker__percent">
          {Math.round(progressPercent)}%
        </span>
      </div>

      <div className="progress-tracker__list">
        {stages.map((stage, index) => {
          const isCurrent = stage.id === currentStageId;
          const isCompleted = stage.status === "completed";
          const isSkipped = stage.status === "skipped";
          const isActive = stage.status === "in_progress";

          let stageClass = "progress-item";
          if (isCompleted) stageClass += " progress-item--completed";
          if (isActive) stageClass += " progress-item--active";
          if (isCurrent) stageClass += " progress-item--current";
          if (isSkipped) stageClass += " progress-item--skipped";

          return (
            <div key={stage.id} className={stageClass}>
              <div className="progress-item__step">
                {isCompleted ? "✓" : STAGE_ICONS[stage.status] || index + 1}
              </div>
              <div className="progress-item__content">
                <h4 className="progress-item__title">{stage.title}</h4>
                {stage.description && (
                  <p className="progress-item__desc">{stage.description}</p>
                )}
                {stage.estimatedDays && (
                  <span className="progress-item__eta">
                    Est. {stage.estimatedDays} days
                  </span>
                )}
                {stage.completedAt && (
                  <span className="progress-item__completed">
                    Completed: {new Date(stage.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {index < stages.length - 1 && <div className="progress-item__line" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
