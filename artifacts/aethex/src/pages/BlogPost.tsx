import { useState, useEffect, useMemo } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Clock, Eye, Share2, Copy, Check, MessageSquare, Loader2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-slate-100">
      <div
        className="h-full bg-primary transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

const apiBase = () => import.meta.env.BASE_URL.replace(/\/$/, "");

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function extractTOC(html: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, "");
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    headings.push({ id, text, level: parseInt(match[1]) });
  }
  return headings;
}

function injectIds(html: string) {
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (_, level, _attrs, content) => {
    const text = content.replace(/<[^>]+>/g, "");
    const safeLevel = level === "2" || level === "3" ? level : "2";
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return `<h${safeLevel} id="${id}">${content}</h${safeLevel}>`;
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  "Clinical Tips": "bg-blue-100 text-blue-700",
  "NEET-PG Prep": "bg-violet-100 text-violet-700",
  "Medical News": "bg-rose-100 text-rose-700",
  "Product Guides": "bg-emerald-100 text-emerald-700",
  "Doctor Life": "bg-amber-100 text-amber-700",
  "Research & Studies": "bg-cyan-100 text-cyan-700",
};

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [sessionId] = useState(() => localStorage.getItem("aethex_session_id") ?? Math.random().toString(36).slice(2));
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${apiBase()}/api/blog/posts/${slug}`)
      .then(r => r.json()).then(d => {
        setData(d);
        setComments(d.comments ?? []);
        // SEO
        if (d.post) {
          document.title = d.post.seoTitle || d.post.title;
          const desc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
          if (desc) desc.content = d.post.seoDescription || d.post.excerpt;
          // OG Tags
          const setMeta = (prop: string, content: string) => {
            let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement;
            if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
            el.content = content;
          };
          setMeta("og:title", d.post.title);
          setMeta("og:description", d.post.excerpt);
          setMeta("og:image", d.post.featuredImage);
          setMeta("og:type", "article");
        }
      }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const toc = useMemo(() => data?.post?.content ? extractTOC(data.post.content) : [], [data?.post?.content]);
  const processedContent = useMemo(() => data?.post?.content ? injectIds(data.post.content) : "", [data?.post?.content]);

  useEffect(() => {
    if (toc.length === 0) return;
    const observers: IntersectionObserver[] = [];
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [toc, processedContent]);

  const shareUrl = window.location.href;
  const shareTitle = data?.post?.title ?? "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentBody.trim()) return;
    setCommenting(true);
    try {
      const res = await fetch(`${apiBase()}/api/blog/posts/${slug}/comments`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: commentName, body: commentBody, sessionId }),
      });
      const d = await res.json();
      if (res.ok) {
        setComments(prev => [d.comment, ...prev]);
        setCommentBody("");
      }
    } finally { setCommenting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!data?.post) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-slate-500 font-semibold">Article not found</p>
      <Link href="/blog" className="text-primary hover:underline text-sm">Back to Blog</Link>
    </div>
  );

  const { post, related } = data;

  return (
    <div className="bg-white min-h-screen">
      <ReadingProgressBar />
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="w-full h-72 overflow-hidden">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-10 flex gap-10">
        {/* Article */}
        <article className="flex-1 min-w-0">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-primary text-sm mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className={cn("text-xs font-bold px-3 py-1 rounded-full", CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-600")}>{post.category}</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-6">{post.excerpt}</p>

          {/* Author + Meta */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-lg shrink-0">
              {post.authorName?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-slate-900">{post.authorName}</div>
              <div className="text-sm text-slate-500">{post.authorRole}</div>
            </div>
            <div className="ml-auto flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime} min read</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views} views</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-1"><Share2 className="w-4 h-4" /> Share:</span>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all">WhatsApp</a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all">𝕏 Twitter</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all">LinkedIn</a>
            <button onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all">
              {copied ? <><Check className="w-3 h-3 text-emerald-500" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Link</>}
            </button>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-900 prose-blockquote:border-l-primary prose-blockquote:text-slate-500 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Tags */}
          {post.tags && (post.tags as string[]).length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-8 pt-6 border-t border-slate-100">
              <span className="text-sm text-slate-500">Tags:</span>
              {(post.tags as string[]).map(tag => (
                <span key={tag} className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          )}

          {/* Comments */}
          <div className="mt-10 pt-8 border-t border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Comments ({comments.length})</h3>
            <form onSubmit={handleComment} className="mb-6 space-y-3">
              <input value={commentName} onChange={e => setCommentName(e.target.value)} placeholder="Your name" required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <textarea value={commentBody} onChange={e => setCommentBody(e.target.value)} placeholder="Share your thoughts..." rows={3} required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
              <button type="submit" disabled={commenting}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60">
                {commenting && <Loader2 className="w-4 h-4 animate-spin" />} Post Comment
              </button>
            </form>
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-sm shrink-0">
                    {c.authorName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800 text-sm">{c.authorName}</span>
                      <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{c.body}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-slate-400 text-sm text-center py-4">Be the first to comment!</p>}
            </div>
          </div>

          {/* Related Posts */}
          {related && related.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((r: any) => (
                  <Link key={r.id} href={`/blog/${r.slug}`}
                    className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all group">
                    {r.featuredImage && <img src={r.featuredImage} alt={r.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />}
                    <div className="p-3">
                      <p className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-primary transition-colors">{r.title}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />{r.readTime} min read
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* TOC Sidebar */}
        {toc.length > 0 && (
          <aside className="w-60 shrink-0 hidden xl:block">
            <div className="sticky top-24">
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Table of Contents</p>
                <nav className="space-y-1">
                  {toc.map(h => (
                    <a key={h.id} href={`#${h.id}`}
                      className={cn("block text-xs py-1 px-2 rounded-lg transition-all hover:text-primary hover:bg-white", h.level === 3 ? "pl-5 text-slate-400" : "text-slate-600 font-medium", activeSection === h.id && "text-primary bg-white shadow-sm")}>
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
