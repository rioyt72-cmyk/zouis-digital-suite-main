import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar, User, Heart, MessageCircle, ArrowLeft, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author_name: string;
  published_at: string | null;
  created_at: string;
}

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentForm, setCommentForm] = useState({
    author_name: "",
    author_email: "",
    content: "",
  });

  // Generate a unique identifier for this user/session
  const getUserIdentifier = () => {
    let identifier = localStorage.getItem("blog_user_id");
    if (!identifier) {
      identifier = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("blog_user_id", identifier);
    }
    return identifier;
  };

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) {
      setLoading(false);
      return;
    }

    setBlog(data);
    await Promise.all([
      fetchLikes(data.id),
      fetchComments(data.id),
    ]);
    setLoading(false);
  };

  const fetchLikes = async (blogId: string) => {
    const { data, count } = await supabase
      .from("blog_likes")
      .select("*", { count: "exact" })
      .eq("blog_id", blogId);

    if (count !== null) {
      setLikeCount(count);
    }

    // Check if current user has liked
    const userIdentifier = getUserIdentifier();
    const userLike = data?.find(like => like.user_identifier === userIdentifier);
    setHasLiked(!!userLike);
  };

  const fetchComments = async (blogId: string) => {
    const { data } = await supabase
      .from("blog_comments")
      .select("id, author_name, content, created_at")
      .eq("blog_id", blogId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (data) {
      setComments(data);
    }
  };

  const handleLike = async () => {
    if (!blog) return;

    const userIdentifier = getUserIdentifier();

    if (hasLiked) {
      // Unlike
      await supabase
        .from("blog_likes")
        .delete()
        .eq("blog_id", blog.id)
        .eq("user_identifier", userIdentifier);
      
      setLikeCount(prev => prev - 1);
      setHasLiked(false);
    } else {
      // Like
      const { error } = await supabase
        .from("blog_likes")
        .insert({ blog_id: blog.id, user_identifier: userIdentifier });

      if (!error) {
        setLikeCount(prev => prev + 1);
        setHasLiked(true);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !commentForm.author_name.trim() || !commentForm.content.trim()) return;

    setSubmittingComment(true);

    const { error } = await supabase
      .from("blog_comments")
      .insert({
        blog_id: blog.id,
        author_name: commentForm.author_name.trim(),
        author_email: commentForm.author_email.trim() || null,
        content: commentForm.content.trim(),
      });

    if (error) {
      toast.error("Failed to submit comment. Please try again.");
    } else {
      toast.success("Comment submitted! It will appear after approval.");
      setCommentForm({ author_name: "", author_email: "", content: "" });
    }

    setSubmittingComment(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-heading font-bold mb-4">Blog Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <article className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {blog.author_name}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(blog.published_at || blog.created_at), "MMMM d, yyyy")}
              </span>
            </div>
          </header>

          {/* Cover Image */}
          {blog.cover_image && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
          </div>

          {/* Like Button */}
          <div className="flex items-center gap-4 py-6 border-y border-border mb-12">
            <Button
              variant={hasLiked ? "default" : "outline"}
              onClick={handleLike}
              className="gap-2"
            >
              <Heart className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
              {hasLiked ? "Liked" : "Like"}
            </Button>
            <span className="text-muted-foreground">
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </span>
          </div>

          {/* Comments Section */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8 p-6 rounded-2xl bg-card/50 border border-border/50">
              <h3 className="font-semibold mb-4">Leave a Comment</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Input
                    placeholder="Your Name *"
                    value={commentForm.author_name}
                    onChange={(e) => setCommentForm({ ...commentForm, author_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email (optional)"
                    value={commentForm.author_email}
                    onChange={(e) => setCommentForm({ ...commentForm, author_email: e.target.value })}
                  />
                </div>
              </div>
              <Textarea
                placeholder="Write your comment... *"
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                required
                rows={4}
                className="mb-4"
              />
              <Button type="submit" disabled={submittingComment}>
                {submittingComment ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit Comment
              </Button>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-6 rounded-xl bg-card/30 border border-border/30"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {comment.author_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{comment.author_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
