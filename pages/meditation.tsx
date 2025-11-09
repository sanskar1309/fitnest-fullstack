import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  english_name: string;
  practice_benefits: string;
  practice_description: string;
  suggested_duration: string;
}

interface MeditationCategory {
  id: number;
  category_name: string;
  category_description: string;
  practices: MeditationPractice[];
}

export default function Meditation() {
  const [categories, setCategories] = useState<MeditationCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MeditationCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<MeditationPractice | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/meditation");
        if (!res.ok) throw new Error("Failed to fetch meditation categories");
        const response = await res.json();
        const data: MeditationCategory[] = response.data || response;
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0]);
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
    fetchCategories();
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
                  <CardTitle>{category.category_name}</CardTitle>
                  <CardDescription>{category.category_description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div id="practices" className="md:w-2/3 space-y-6">
            {selectedCategory ? (
              <>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Practices in {selectedCategory.category_name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedCategory.practices.map((practice) => (
                    <Card key={practice.id} className="border-border cursor-pointer" onClick={() => handlePracticeClick(practice)}>
                      <CardHeader>
                        <CardTitle>{practice.english_name}</CardTitle>
                        <CardDescription>Suggested Duration: {practice.suggested_duration}</CardDescription>
                      </CardHeader>
                      <CardContent className="h-45 flex flex-col justify-between">
                        <p className="text-muted-foreground text-sm">
                          {practice.practice_benefits.length > 120
                            ? `${practice.practice_benefits.slice(0, 120)}... `
                            : practice.practice_benefits}
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-[90vw] sm:w-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>{modalData?.english_name}</DialogTitle>
              <DialogDescription>
                Suggested Duration: {modalData?.suggested_duration}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description:</h4>
                <p className="text-sm text-muted-foreground">{modalData?.practice_description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Benefits:</h4>
                <p className="text-sm text-muted-foreground">{modalData?.practice_benefits}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
