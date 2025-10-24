<?php

namespace App\Services;

use App\Models\BuildingOption;
use App\Models\BuildingArticle;
use App\Models\BuildingOptionsSetting;
use Illuminate\Support\Str;

class BuildingOptionsService
{
    // Building Options
    public function getAllOptions()
    {
        return BuildingOption::where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function getAllOptionsForAdmin()
    {
        return BuildingOption::orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function getOptionForAdmin(int $id)
    {
        return BuildingOption::findOrFail($id);
    }

    public function createOption(array $data): BuildingOption
    {
        return BuildingOption::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'section_image_id' => $data['section_image_id'],
            'order' => $data['order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    public function updateOption(int $id, array $data): BuildingOption
    {
        $option = BuildingOption::findOrFail($id);

        $option->update([
            'title' => $data['title'] ?? $option->title,
            'description' => $data['description'] ?? $option->description,
            'section_image_id' => $data['section_image_id'] ?? $option->section_image_id,
            'order' => $data['order'] ?? $option->order,
            'is_active' => $data['is_active'] ?? $option->is_active,
        ]);

        return $option;
    }

    public function deleteOption(int $id): void
    {
        $option = BuildingOption::findOrFail($id);
        $option->delete();
    }

    // Building Articles
    public function getAllArticles()
    {
        return BuildingArticle::where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function getArticleBySlug(string $slug)
    {
        return BuildingArticle::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
    }

    public function getAllArticlesForAdmin()
    {
        return BuildingArticle::orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function getArticleForAdmin(int $id)
    {
        return BuildingArticle::findOrFail($id);
    }

    public function createArticle(array $data): BuildingArticle
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        return BuildingArticle::create([
            'slug' => $data['slug'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'image_id' => $data['image_id'],
            'content' => $data['content'],
            'order' => $data['order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    public function updateArticle(int $id, array $data): BuildingArticle
    {
        $article = BuildingArticle::findOrFail($id);

        if (empty($data['slug']) && isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $article->update([
            'slug' => $data['slug'] ?? $article->slug,
            'title' => $data['title'] ?? $article->title,
            'description' => $data['description'] ?? $article->description,
            'image_id' => $data['image_id'] ?? $article->image_id,
            'content' => $data['content'] ?? $article->content,
            'order' => $data['order'] ?? $article->order,
            'is_active' => $data['is_active'] ?? $article->is_active,
        ]);

        return $article;
    }

    public function deleteArticle(int $id): void
    {
        $article = BuildingArticle::findOrFail($id);
        $article->delete();
    }

    // Settings
    public function getSettings()
    {
        return BuildingOptionsSetting::first();
    }

    public function updateSettings(array $data)
    {
        $settings = BuildingOptionsSetting::first();

        if ($settings) {
            $settings->update($data);
        } else {
            $settings = BuildingOptionsSetting::create($data);
        }

        return $settings;
    }
}
