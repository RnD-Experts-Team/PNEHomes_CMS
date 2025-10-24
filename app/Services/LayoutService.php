<?php

namespace App\Services;

use App\Models\Navigation;
use App\Models\NavigationLink;
use App\Models\FooterLink;
use App\Models\ContactInfo;
use App\Models\SocialLink;

class LayoutService
{
    public function getLayoutData()
    {
        return [
            'navigation' => Navigation::first(),
            'navigation_links' => NavigationLink::orderBy('order')->get(),
            'footer_links' => FooterLink::orderBy('order')->get(),
            'contact_info' => ContactInfo::first(),
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

    // Navigation Links
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
        return NavigationLink::create($data);
    }

    public function updateNavigationLink(int $id, array $data)
    {
        $link = NavigationLink::findOrFail($id);
        $link->update($data);
        return $link;
    }

    public function deleteNavigationLink(int $id)
    {
        $link = NavigationLink::findOrFail($id);
        $link->delete();
    }

    // Footer Links
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
        return FooterLink::create($data);
    }

    public function updateFooterLink(int $id, array $data)
    {
        $link = FooterLink::findOrFail($id);
        $link->update($data);
        return $link;
    }

    public function deleteFooterLink(int $id)
    {
        $link = FooterLink::findOrFail($id);
        $link->delete();
    }

    // Contact Info
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

    // Social Links
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
}
