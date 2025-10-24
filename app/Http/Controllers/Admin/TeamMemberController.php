<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TeamService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamMemberController extends Controller
{
    public function __construct(
        protected TeamService $teamService
    ) {}

    public function index()
    {
        $members = $this->teamService->getAllMembersForAdmin();

        return Inertia::render('Team/Index', [
            'members' => $members,
        ]);
    }

    public function create()
    {
        return Inertia::render('Team/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cover_image_id' => 'required|string',
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'description' => 'required|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $this->teamService->createMember($validated);

            return redirect()
                ->route('team-members.index')
                ->with('success', 'Team member created successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to create team member: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function edit(int $id)
    {
        $member = $this->teamService->getMemberForAdmin($id);

        return Inertia::render('Team/Edit', [
            'member' => $member,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'cover_image_id' => 'required|string',
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'description' => 'required|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $this->teamService->updateMember($id, $validated);

            return redirect()
                ->route('team-members.index')
                ->with('success', 'Team member updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update team member: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->teamService->deleteMember($id);

            return redirect()
                ->route('team-members.index')
                ->with('success', 'Team member deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete team member']);
        }
    }
}
