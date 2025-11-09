import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tutorial } from "@/components/TutorialCard";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadTutorialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tutorial: Omit<Tutorial, 'id'>) => Promise<void>;
}

export const UploadTutorialForm = ({ open, onOpenChange, onSubmit }: UploadTutorialFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: ""
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile || !zipFile) {
      toast({
        title: "Arquivos obrigatórios",
        description: "Por favor, selecione os arquivos de vídeo e ZIP.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Upload video file
      const videoFileName = `${Date.now()}-${videoFile.name}`;
      const { data: videoData, error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile);

      if (videoError) throw videoError;

      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);

      // Upload zip file
      const zipFileName = `${Date.now()}-${zipFile.name}`;
      const { data: zipData, error: zipError } = await supabase.storage
        .from('zip-files')
        .upload(zipFileName, zipFile);

      if (zipError) throw zipError;

      const { data: { publicUrl: zipUrl } } = supabase.storage
        .from('zip-files')
        .getPublicUrl(zipFileName);

      // Upload thumbnail if provided
      let thumbnailUrl = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80";
      if (thumbnailFile) {
        const thumbnailFileName = `${Date.now()}-${thumbnailFile.name}`;
        const { data: thumbnailData, error: thumbnailError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailFileName, thumbnailFile);

        if (thumbnailError) throw thumbnailError;

        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(thumbnailFileName);
        
        thumbnailUrl = publicUrl;
      }

      const tutorial: Omit<Tutorial, 'id'> = {
        ...formData,
        videoUrl,
        zipUrl,
        thumbnail: thumbnailUrl
      };

      await onSubmit(tutorial);
      
      toast({
        title: "Tutorial adicionado!",
        description: "O tutorial foi salvo com sucesso."
      });

      // Reset form
      setFormData({ title: "", description: "", category: "", duration: "" });
      setVideoFile(null);
      setZipFile(null);
      setThumbnailFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro ao adicionar tutorial",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Tutorial</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Introdução ao React"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o conteúdo do tutorial..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Frontend"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração *</Label>
              <Input
                id="duration"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ex: 12:30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Vídeo * (MP4, WebM)</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              required
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">Arquivo ZIP * (arquivos do projeto)</Label>
            <Input
              id="zip"
              type="file"
              accept=".zip"
              required
              onChange={(e) => setZipFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail (opcional)</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Adicionar Tutorial
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
