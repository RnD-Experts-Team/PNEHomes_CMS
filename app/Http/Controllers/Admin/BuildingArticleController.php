<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BuildingOptionsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuildingArticleController extends Controller
{
    public function __construct(
        protected BuildingOptionsService $buildingOptionsService
    ) {}

    public function index()
    {
        $articles = $this->buildingOptionsService->getAllArticlesForAdmin();

        return Inertia::render('BuildingOptions/Articles/Index', [
            'articles' => $articles,
        ]);
    }

    public function create()
    {
        return Inertia::render('BuildingOptions/Articles/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|unique:building_articles,slug',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_id' => 'required|string',
            'content' => 'required|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $this->buildingOptionsService->createArticle($validated);

            return redirect()
                ->route('building-articles.index')
                ->with('success', 'Article created successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to create article: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function edit(int $id)
    {
        $article = $this->buildingOptionsService->getArticleForAdmin($id);

        return Inertia::render('BuildingOptions/Articles/Edit', [
            'article' => $article,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|unique:building_articles,slug,' . $id,
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_id' => 'required|string',
            'content' => 'required|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $this->buildingOptionsService->updateArticle($id, $validated);

            return redirect()
                ->route('building-articles.index')
                ->with('success', 'Article updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update article: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->buildingOptionsService->deleteArticle($id);

            return redirect()
                ->route('building-articles.index')
                ->with('success', 'Article deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete article']);
        }
    }
}
