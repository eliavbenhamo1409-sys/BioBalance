'use client';

import { TopBar } from '@/components/TopBar';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Recipe {
  id: string;
  user_id: string;
  title: string;
  content: string;
  calories: number;
  protein: number;
  fat: number;
  tags?: string[];
  created_at: string;
  user_email?: string;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="מתכונים שמורים"
        description="כל המתכונים שנשמרו על ידי המשתמשים"
      />

      <div className="p-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="חיפוש לפי כותרת או תגיות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{recipes.length}</h3>
              <p className="text-gray-600">סה״כ מתכונים שמורים</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl">
              <span className="text-3xl">📖</span>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {recipe.title}
                </h3>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                  {recipe.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">קלוריות</p>
                    <p className="text-lg font-bold text-orange-600">{recipe.calories}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">חלבון</p>
                    <p className="text-lg font-bold text-blue-600">{Math.round(recipe.protein)}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">שומן</p>
                    <p className="text-lg font-bold text-purple-600">{Math.round(recipe.fat)}g</p>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  {recipe.user_email || 'משתמש לא ידוע'}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredRecipes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">לא נמצאו מתכונים</p>
          </div>
        )}

        {/* Recipe Modal */}
        {selectedRecipe && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRecipe(null)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedRecipe.title}
              </h2>

              <div className="flex gap-2 mb-6 flex-wrap">
                {selectedRecipe.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">קלוריות</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedRecipe.calories}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">חלבון</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(selectedRecipe.protein)}g</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">שומן</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(selectedRecipe.fat)}g</p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">תוכן המתכון</h3>
                <div className="whitespace-pre-wrap text-gray-700">
                  {selectedRecipe.content}
                </div>
              </div>

              <button
                onClick={() => setSelectedRecipe(null)}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                סגור
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

