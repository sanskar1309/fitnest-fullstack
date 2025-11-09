import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LottieLoader } from "@/components/ui/LottieLoader";

interface MeditationPractice {
  id: number;
  title: string;
  difficulty: string;
  benefits: string[];
  description: string;
  steps: string[];
  affirmation: string;
  duration: string;
  environment: string;
  audio_url: string;
  video_url: string;
  tags: string[];
}

interface MeditationCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  practices: MeditationPractice[];
}

interface Mood {
  id: number;
  mood: string;
  description: string;
  recommended_practices: number[];
}

export default function Meditation() {
  const [categories, setCategories] = useState<MeditationCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MeditationCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [allPractices, setAllPractices] = useState<MeditationPractice[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<MeditationPractice | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch meditation categories
        const res = await fetch("/api/v1/meditation");
        if (!res.ok) throw new Error("Failed to fetch meditation categories");
        const response = await res.json();
        const data: MeditationCategory[] = response.data || response;
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0]);

        // Flatten all practices for mood filtering
        const practices = data.flatMap(category => category.practices);
        setAllPractices(practices);

        // Fetch moods
        const moodsRes = await fetch("/api/v1/moods");
        if (!moodsRes.ok) throw new Error("Failed to fetch moods");
        const moodsResponse = await moodsRes.json();
        const moodsData: Mood[] = moodsResponse.data || moodsResponse;
        setMoods(moodsData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handlePracticeClick(practice: MeditationPractice) {
    setModalData(practice);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <LottieLoader />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-foreground mb-6">Meditation Practices</h1>

        {error && <p className="text-destructive">Error: {error}</p>}

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">By Categories</TabsTrigger>
            <TabsTrigger value="moods">By Moods</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-6">
            <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer ${
                  selectedCategory?.id === category.id ? "border-primary" : "border-border"
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  const practicesElement = document.getElementById('practices');
                  if (practicesElement) {
                    if (window.innerWidth >= 768) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      practicesElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {category.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div id="practices" className="md:w-2/3 space-y-6">
            {selectedCategory ? (
              <>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Practices in {selectedCategory.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedCategory.practices.map((practice) => (
                    <Card key={practice.id} className="border-border cursor-pointer" onClick={() => handlePracticeClick(practice)}>
                      <CardHeader>
                        <CardTitle>{practice.title}</CardTitle>
                        <CardDescription>Duration: {practice.duration} | Difficulty: {practice.difficulty}</CardDescription>
                      </CardHeader>
                      <CardContent className="h-45 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {practice.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {practice.description.length > 120
                              ? `${practice.description.slice(0, 120)}... `
                              : practice.description}
                            <button
                              className="text-primary underline text-xs ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePracticeClick(practice);
                              }}
                              type="button"
                            >
                              view more
                            </button>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <p>Select a category to see practices</p>
            )}
          </div>
        </div>
          </TabsContent>

          <TabsContent value="moods" className="mt-6">
            <div className="mb-6">
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select a mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Moods</SelectItem>
                  {moods.map((mood) => (
                    <SelectItem key={mood.id} value={mood.mood}>
                      {mood.mood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Select a mood to see practices based on mood
              </h2>
              {selectedMood && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allPractices
                    .filter((practice) => {
                      if (selectedMood === "all") return true;
                      const mood = moods.find((m) => m.mood === selectedMood);
                      return mood ? mood.recommended_practices.includes(practice.id) : false;
                    })
                    .map((practice) => (
                    <Card key={practice.id} className="border-border cursor-pointer" onClick={() => handlePracticeClick(practice)}>
                      <CardHeader>
                        <CardTitle>{practice.title}</CardTitle>
                        <CardDescription>Duration: {practice.duration} | Difficulty: {practice.difficulty}</CardDescription>
                      </CardHeader>
                      <CardContent className="h-45 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {practice.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {practice.description.length > 120
                              ? `${practice.description.slice(0, 120)}... `
                              : practice.description}
                            <button
                              className="text-primary underline text-xs ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePracticeClick(practice);
                              }}
                              type="button"
                            >
                              view more
                            </button>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-[90vw] sm:w-auto max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{modalData?.title}</DialogTitle>
              <DialogDescription>
                Duration: {modalData?.duration} | Difficulty: {modalData?.difficulty} | Environment: {modalData?.environment}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description:</h4>
                <p className="text-sm text-muted-foreground">{modalData?.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Benefits:</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {modalData?.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Steps:</h4>
                <ol className="text-sm text-muted-foreground list-decimal list-inside">
                  {modalData?.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              {modalData?.affirmation && (
                <div>
                  <h4 className="font-semibold mb-2">Affirmation:</h4>
                  <p className="text-sm text-muted-foreground italic">"{modalData.affirmation}"</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-1">
                  {modalData?.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {modalData?.video_url && (
                <div>
                  <h4 className="font-semibold mb-2">Video:</h4>
                  <video controls className="w-full max-w-md">
                    <source src={modalData.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {modalData?.audio_url && (
                <div>
                  <h4 className="font-semibold mb-2">Audio:</h4>
                  <audio controls className="w-full">
                    <source src={modalData.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
