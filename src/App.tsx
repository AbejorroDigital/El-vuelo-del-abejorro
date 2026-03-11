import { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum: number) => {
    setLoading(true);
    window.scrollTo(0, 0);
    try {
      // Conexión a la API REST de WordPress a través del proxy de Vercel (o Vite en local)
      // Esto evita los bloqueos de CORS del proveedor de hosting gratuito
      const response = await fetch(`/api/wp/posts?_embed&per_page=10&page=${pageNum}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);
        setHasMore(data.length === 10);
      } else {
        setPosts([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Fallo de conexión", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const getImg = (p: any) => p._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  if (selectedPost) {
    return (
      <div className="fade-in min-h-screen p-6">
        <button onClick={() => setSelectedPost(null)} className="back-btn">
          <X size={24} />
        </button>
        <header className="mb-8 text-center">
          <h1 
            className="text-3xl font-bold leading-tight" 
            dangerouslySetInnerHTML={{ __html: selectedPost.title.rendered }} 
          />
        </header>
        <article 
          className="wp-content" 
          dangerouslySetInnerHTML={{ __html: selectedPost.content.rendered }} 
        />
        <footer className="py-10 text-center opacity-30 text-[10px] tracking-[0.3em]">
          EL VUELO DEL ABEJORRO
        </footer>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <header className="p-6 border-b border-orange-900/30 text-center bg-black/20">
        <h1 className="text-2xl tracking-tighter">EL VUELO DEL ABEJORRO</h1>
        <p className="text-[9px] tracking-[0.4em] text-cyan-400 uppercase">Visor de Bitácora Digital</p>
      </header>

      <main className="p-4 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-orange-500" size={48} />
          </div>
        ) : (
          posts.map(post => (
            <div 
              key={post.id} 
              onClick={() => setSelectedPost(post)} 
              className="border-b border-orange-900/20 pb-6 active:opacity-70 transition-all cursor-pointer"
            >
              {getImg(post) && (
                <img 
                  src={getImg(post)} 
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg shadow-black" 
                />
              )}
              <h2 
                className="text-xl mb-2" 
                dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
              />
              <div 
                className="text-sm opacity-70 line-clamp-2" 
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} 
              />
            </div>
          ))
        )}
      </main>

      {!loading && (
        <footer className="flex justify-around p-8 border-t border-orange-900/20">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            className="text-orange-500 font-bold uppercase text-xs disabled:opacity-50"
            disabled={page === 1}
          >
            Anterior
          </button>
          <span className="text-cyan-500 font-bold">{page}</span>
          <button 
            onClick={() => setPage(p => p + 1)} 
            className="text-orange-500 font-bold uppercase text-xs disabled:opacity-50"
            disabled={!hasMore}
          >
            Siguiente
          </button>
        </footer>
      )}
    </div>
  );
}
