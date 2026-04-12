import { useRef, useEffect, useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";

const USERNAME = "vein05";
const API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;

/** Matches tailwind tokens: paper-surface, border-paper, ink-blue ramp */
const paperTheme = {
  light: ["#edeae0", "#d4cfc4", "#93bae8", "#2563eb", "#1d4ed8"],
  dark: ["#edeae0", "#d4cfc4", "#93bae8", "#2563eb", "#1d4ed8"],
};

function sumCounts(activities) {
  return activities.reduce((s, a) => s + a.count, 0);
}

const LEGEND_BLOCK = 7;
const LEGEND_RADIUS = 1;

function ContributionIntensityLegend() {
  return (
    <div className="flex items-center gap-1 text-[9px] text-ink-muted">
      <span className="mr-0.5">Less</span>
      {paperTheme.light.map((fill, level) => (
        <svg key={level} width={LEGEND_BLOCK} height={LEGEND_BLOCK} className="shrink-0" aria-hidden="true">
          <rect
            width={LEGEND_BLOCK}
            height={LEGEND_BLOCK}
            rx={LEGEND_RADIUS}
            ry={LEGEND_RADIUS}
            fill={fill}
            stroke="rgba(0, 0, 0, 0.08)"
          />
        </svg>
      ))}
      <span className="ml-0.5">More</span>
    </div>
  );
}

/** Horizontal scroll lives on `.react-activity-calendar__scroll-container`, not the outer wrapper. */
function useScrollCalendarToLatest(calendarRef) {
  useEffect(() => {
    const article = calendarRef.current;
    if (!article) return;

    let observedScrollEl = null;

    const run = () => {
      requestAnimationFrame(() => {
        const sc = article.querySelector(".react-activity-calendar__scroll-container");
        if (!sc) return;
        sc.scrollLeft = sc.scrollWidth - sc.clientWidth;
        if (sc !== observedScrollEl) {
          if (observedScrollEl) ro.unobserve(observedScrollEl);
          observedScrollEl = sc;
          ro.observe(sc);
        }
      });
    };

    const ro = new ResizeObserver(run);
    const mo = new MutationObserver(run);
    mo.observe(article, { childList: true, subtree: true });
    ro.observe(article);
    run();

    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, []);
}

const GitHubContributions = () => {
  const calendarRef = useRef(null);
  useScrollCalendarToLatest(calendarRef);

  const [chartData, setChartData] = useState([]);
  const [yearTotal, setYearTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(API_URL)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok || json.error) {
          throw new Error(json.error || "Request failed");
        }
        return json;
      })
      .then((json) => {
        if (cancelled) return;
        const all = json.contributions;
        if (!Array.isArray(all)) {
          throw new Error("Unexpected response");
        }
        setYearTotal(sumCounts(all));
        setChartData(all);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load activity");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="w-full min-w-0 border border-border-paper bg-paper-surface/60 px-2 py-2">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="text-[9px] font-mono text-ink-muted">am i sleeping?</span>
          <a
            href={`https://www.github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-mono text-ink-blue hover:underline"
          >
            @{USERNAME}
          </a>
        </div>
        <p className="text-[9px] font-mono text-ink-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 border border-border-paper bg-paper-surface/60 px-2 py-2">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-[9px] font-mono text-ink-muted">am i sleeping?</span>
        <a
          href={`https://www.github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] font-mono text-ink-blue hover:underline"
        >
          @{USERNAME}
        </a>
      </div>
      <div className="w-full min-w-0 font-sans text-ink-dark leading-none">
        <ActivityCalendar
          ref={calendarRef}
          data={chartData}
          loading={loading}
          maxLevel={4}
          colorScheme="light"
          theme={paperTheme}
          className="github-contributions-calendar w-full max-w-full text-[9px]"
          blockSize={7}
          blockMargin={2}
          blockRadius={1}
          fontSize={9}
          showWeekdayLabels={false}
          showMonthLabels
          showTotalCount={false}
          showColorLegend={false}
        />
        {yearTotal != null && !loading && (
          <div className="mt-1 flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="text-[9px] font-mono text-ink-muted">
              {yearTotal.toLocaleString()} commits last year
            </span>
            <ContributionIntensityLegend />
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubContributions;
