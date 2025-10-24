<?php

namespace App\Services;

use App\Models\TeamMember;
use App\Models\TeamSetting;
use Illuminate\Support\Facades\DB;

class TeamService
{
    public function getAllMembers()
    {
        return TeamMember::where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function getAllMembersForAdmin()
    {
        return TeamMember::orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function getMemberForAdmin(int $id)
    {
        return TeamMember::findOrFail($id);
    }

    public function createMember(array $data): TeamMember
    {
        return TeamMember::create([
            'cover_image_id' => $data['cover_image_id'],
            'name' => $data['name'],
            'position' => $data['position'],
            'description' => $data['description'],
            'order' => $data['order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    public function updateMember(int $id, array $data): TeamMember
    {
        $member = TeamMember::findOrFail($id);

        $member->update([
            'cover_image_id' => $data['cover_image_id'] ?? $member->cover_image_id,
            'name' => $data['name'] ?? $member->name,
            'position' => $data['position'] ?? $member->position,
            'description' => $data['description'] ?? $member->description,
            'order' => $data['order'] ?? $member->order,
            'is_active' => $data['is_active'] ?? $member->is_active,
        ]);

        return $member;
    }

    public function deleteMember(int $id): void
    {
        $member = TeamMember::findOrFail($id);
        $member->delete();
    }

    public function getSettings()
    {
        return TeamSetting::first();
    }

    public function updateSettings(array $data)
    {
        $settings = TeamSetting::first();

        if ($settings) {
            $settings->update($data);
        } else {
            $settings = TeamSetting::create($data);
        }

        return $settings;
    }
}
