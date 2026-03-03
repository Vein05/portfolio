import React from "react";
import { ArrowRight } from "lucide-react";
import { posts } from "../../data/posts";

function WritingSidebar({ limit = 3 }) {
  const recentPosts = React.useMemo(
    () =>
      [...posts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit),
    [limit]
  );

  return (
    <div className="sidebar-panel hidden lg:flex flex-col border-l border-border-paper sticky top-[3.5rem] h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="py-6 px-5 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs uppercase tracking-widest text-ink-muted">Writing</h2>
          <a
            href="/blog"
            className="text-xs uppercase tracking-wider text-ink-blue hover:text-ink-dark transition-colors flex items-center gap-1"
          >
            All <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        <ul className="flex flex-col gap-0 flex-1">
          {recentPosts.map((post) => (
            <li key={post.slug} className="border-b border-border-paper last:border-0">
              <a
                href={`/blog/${post.slug}`}
                className="group block py-4 hover:bg-ink-dark transition-colors duration-150 -mx-5 px-5"
              >
                <span className="text-[10px] uppercase tracking-wider text-ink-blue block mb-1">
                  {post.category}
                </span>
                <p className="text-sm text-ink-dark group-hover:text-paper-light leading-snug transition-colors line-clamp-2">
                  {post.title}
                </p>
                <time className="text-[10px] text-ink-muted group-hover:text-paper-light group-hover:opacity-50 mt-1.5 block transition-colors duration-150">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WritingSidebar;