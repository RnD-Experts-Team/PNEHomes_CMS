<?php

namespace App\Services;

use App\Models\FloorPlan;
use Illuminate\Support\Str;

class FloorPlanService
{
    public function getAllFloorPlans()
    {
        return FloorPlan::where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function getAllFloorPlansForAdmin()
    {
        return FloorPlan::orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function getFloorPlanForAdmin(int $id)
    {
        return FloorPlan::findOrFail($id);
    }

    public function createFloorPlan(array $data): FloorPlan
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        return FloorPlan::create([
            'slug' => $data['slug'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'image_id' => $data['image_id'],
            'bedroom' => $data['bedroom'],
            'bathroom' => $data['bathroom'],
            'floor' => $data['floor'],
            'area' => $data['area'],
            'order' => $data['order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    public function updateFloorPlan(int $id, array $data): FloorPlan
    {
        $floorPlan = FloorPlan::findOrFail($id);

        if (empty($data['slug']) && isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $floorPlan->update([
            'slug' => $data['slug'] ?? $floorPlan->slug,
            'title' => $data['title'] ?? $floorPlan->title,
            'description' => $data['description'] ?? $floorPlan->description,
            'image_id' => $data['image_id'] ?? $floorPlan->image_id,
            'bedroom' => $data['bedroom'] ?? $floorPlan->bedroom,
            'bathroom' => $data['bathroom'] ?? $floorPlan->bathroom,
            'floor' => $data['floor'] ?? $floorPlan->floor,
            'area' => $data['area'] ?? $floorPlan->area,
            'order' => $data['order'] ?? $floorPlan->order,
            'is_active' => $data['is_active'] ?? $floorPlan->is_active,
        ]);

        return $floorPlan;
    }

    public function deleteFloorPlan(int $id): void
    {
        $floorPlan = FloorPlan::findOrFail($id);
        $floorPlan->delete();
    }
}
