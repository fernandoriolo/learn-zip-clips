import { useState } from "react";
import { TutorialCard, Tutorial } from "@/components/TutorialCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { UploadTutorialForm } from "@/components/UploadTutorialForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTutorials } from "@/hooks/useTutorials";

const Index = () => {
  const { tutorials, addTutorial, loading } = useTutorials();
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const categories = Array.from(new Set(tutorials.map(t => t.category)));

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gradient-primary)]">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Tutorial Hub</h1>
                <p className="text-sm text-muted-foreground">Aprenda no seu ritmo</p>
              </div>
            </div>
            <Button onClick={() => setShowUploadForm(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Tutorial
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Biblioteca de Tutoriais
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore nossa coleção de tutoriais em vídeo. Baixe os arquivos do projeto e pratique junto.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar tutoriais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tutorials Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">Carregando tutoriais...</p>
          </div>
        ) : filteredTutorials.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTutorials.map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                onPlayVideo={setSelectedTutorial}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              Nenhum tutorial encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </main>

      {/* Video Player Modal */}
      <VideoPlayer
        tutorial={selectedTutorial}
        open={selectedTutorial !== null}
        onOpenChange={(open) => !open && setSelectedTutorial(null)}
      />

      {/* Upload Form Modal */}
      <UploadTutorialForm
        open={showUploadForm}
        onOpenChange={setShowUploadForm}
        onSubmit={addTutorial}
      />
    </div>
  );
};

export default Index;
