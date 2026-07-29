import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirestoreInstance() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getFirestore(app);
}

interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  publishDate: string;
  excerpt: string;
  content?: string;
  image?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const db = getFirestoreInstance();
    const snap = await getDoc(doc(db, "blogs", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as BlogPost;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) return { title: "Article Not Found | O.G. Agency" };
  return {
    title: `${post.title} | O.G. Agency Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) notFound();

  // Split content into readable paragraphs by double-newline
  const bodyText = post.content || post.excerpt || "";
  const paragraphs = bodyText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col w-full min-h-screen bg-main-50">

      {/* ── Hero Banner ───────────────────────────────────────── */}
      <div className="relative w-full h-[60vh] min-h-[380px] max-h-[540px] overflow-hidden">
        <img
          src={
            post.image ||
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1600"
          }
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-main-900/90 via-main-900/50 to-transparent" />

        {/* Back button */}
        <div className="absolute top-8 left-6 lg:left-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-semibold hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>

        {/* Hero title */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-16 pb-10 max-w-[1000px]">
          <span className="inline-block px-3.5 py-1.5 rounded-xl bg-main-500/90 text-main-900 font-bold text-[10px] tracking-wider uppercase backdrop-blur-md mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="flex items-center flex-wrap gap-6 mt-5 text-white/70 text-sm font-medium">
            <span className="flex items-center gap-2">
              <User size={15} />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={15} />
              {post.publishDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={15} />
              {post.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* ── Article Body ─────────────────────────────────────── */}
      <article className="w-full px-6 lg:px-16 py-16">
        <div className="max-w-[760px] mx-auto">

          {/* Excerpt / lead paragraph */}
          <p className="text-lg sm:text-xl text-main-700 font-medium leading-relaxed border-l-4 border-main-500 pl-6 mb-12 italic">
            {post.excerpt}
          </p>

          {/* Full body paragraphs */}
          <div className="space-y-6">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="text-main-900/85 text-base sm:text-lg leading-[1.85] font-normal"
                >
                  {para}
                </p>
              ))
            ) : (
              <p className="text-main-900/50 text-base italic">
                Full article content will be available shortly.
              </p>
            )}
          </div>

          {/* Footer author bar */}
          <div className="mt-16 pt-8 border-t border-main-900/10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-main-900 flex items-center justify-center text-white font-bold text-sm">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-main-900">{post.author}</p>
                <p className="text-xs text-main-900/60">
                  {post.category} &bull; {post.publishDate}
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-main-900 text-white text-sm font-bold hover:bg-main-700 transition-colors"
            >
              <ArrowLeft size={15} />
              More Articles
            </Link>
          </div>

        </div>
      </article>
    </div>
  );
}
