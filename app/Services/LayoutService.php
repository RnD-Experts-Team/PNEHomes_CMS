<?php

namespace App\Services;

use App\Models\Navigation;
use App\Models\NavigationLink;
use App\Models\FooterLink;
use App\Models\ContactInfo;
use App\Models\SocialLink;
use Illuminate\Support\Str;
use App\Models\ContactInfoNavigation;

class LayoutService
{
    public function getLayoutData()
    {
        return [
            'navigation' => Navigation::first(),
            'navigation_links' => NavigationLink::orderBy('order')->get(),
            'footer_links' => FooterLink::orderBy('order')->get(),
            'contact_info' => ContactInfo::first(),
            'contact_info_navigation'  => ContactInfoNavigation::first(),
            'social_links' => SocialLink::orderBy('order')->get(),
        ];
    }

    // Navigation
    public function updateNavigation(array $data)
    {
        $navigation = Navigation::first();

        if ($navigation) {
            $navigation->update($data);
        } else {
            $navigation = Navigation::create($data);
        }

        return $navigation;
    }
 public function updateContactInfoNavigation(array $data)
    {
        $contactInfoNav = ContactInfoNavigation::first();

        if ($contactInfoNav) {
            $contactInfoNav->update($data);
        } else {
            $contactInfoNav = ContactInfoNavigation::create($data);
        }

        return $contactInfoNav;
    }
    // ---------- NAV LINKS ----------
    public function getAllNavigationLinks()
    {
        return NavigationLink::orderBy('order')->get();
    }

    public function getNavigationLinkForAdmin(int $id)
    {
        return NavigationLink::findOrFail($id);
    }

    public function createNavigationLink(array $data)
    {
        // slug should be generated from title
        $data['slug'] = $this->makeUniqueSlug(
            $data['title'],
            NavigationLink::class
        );

        return NavigationLink::create($data);
    }

    public function updateNavigationLink(int $id, array $data)
    {
        $link = NavigationLink::findOrFail($id);

        // only regenerate slug if the title changes
        if (isset($data['title']) && $data['title'] !== $link->title) {
            $data['slug'] = $this->makeUniqueSlug(
                $data['title'],
                NavigationLink::class,
                $id
            );
        }

        $link->update($data);
        return $link;
    }

    public function deleteNavigationLink(int $id)
    {
        $link = NavigationLink::findOrFail($id);
        $link->delete();
    }

    // ---------- FOOTER LINKS ----------
    public function getAllFooterLinks()
    {
        return FooterLink::orderBy('order')->get();
    }

    public function getFooterLinkForAdmin(int $id)
    {
        return FooterLink::findOrFail($id);
    }

    public function createFooterLink(array $data)
    {
        $data['slug'] = $this->makeUniqueSlug(
            $data['title'],
            FooterLink::class
        );

        return FooterLink::create($data);
    }

    public function updateFooterLink(int $id, array $data)
    {
        $link = FooterLink::findOrFail($id);

        if (isset($data['title']) && $data['title'] !== $link->title) {
            $data['slug'] = $this->makeUniqueSlug(
                $data['title'],
                FooterLink::class,
                $id
            );
        }

        $link->update($data);
        return $link;
    }

    public function deleteFooterLink(int $id)
    {
        $link = FooterLink::findOrFail($id);
        $link->delete();
    }

    // ---------- Contact Info ----------
    public function updateContactInfo(array $data)
    {
        $contactInfo = ContactInfo::first();

        if ($contactInfo) {
            $contactInfo->update($data);
        } else {
            $contactInfo = ContactInfo::create($data);
        }

        return $contactInfo;
    }

    // ---------- Social Links ----------
    public function getAllSocialLinks()
    {
        return SocialLink::orderBy('order')->get();
    }

    public function getSocialLinkForAdmin(int $id)
    {
        return SocialLink::findOrFail($id);
    }

    public function createSocialLink(array $data)
    {
        return SocialLink::create($data);
    }

    public function updateSocialLink(int $id, array $data)
    {
        $link = SocialLink::findOrFail($id);
        $link->update($data);
        return $link;
    }

    public function deleteSocialLink(int $id)
    {
        $link = SocialLink::findOrFail($id);
        $link->delete();
    }

    // ---------- helpers ----------
    /**
     * Make a unique slug for a model based on a title.
     *
     * @param  string      $title
     * @param  class-string<\Illuminate\Database\Eloquent\Model> $modelClass
     * @param  int|null    $ignoreId  ID to ignore when checking uniqueness (for updates)
     */
    protected function makeUniqueSlug(string $title, string $modelClass, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 2;

        $query = fn($s) => $modelClass::where('slug', $s)
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->exists();

        while ($slug === '' || $query($slug)) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }
}
