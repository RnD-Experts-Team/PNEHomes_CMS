<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FloorPlanService;

class FloorPlanController extends Controller
{
    public function __construct(
        protected FloorPlanService $floorPlanService
    ) {}

    public function index()
    {
        try {
            $floorPlans = $this->floorPlanService->getAllFloorPlans();

            $data = $floorPlans->map(function ($floorPlan) {
                return [
                    'id' => $floorPlan->id,
                    'slug' => $floorPlan->slug,
                    'title' => $floorPlan->title,
                    'description' => $floorPlan->description,
                    'image' => $floorPlan->image_url,
                    'bedroom' => $floorPlan->bedroom,
                    'bathroom' => $floorPlan->bathroom,
                    'floor' => $floorPlan->floor,
                    'area' => $floorPlan->area,
                ];
            })->toArray();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch floor plans',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
