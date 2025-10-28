<?php

namespace App\Services;

use App\Models\AboutUs;
use App\Models\PrivacyPolicy;

class ContentPageService
{
    // About Us
    public function getAboutUs()
    {
        return AboutUs::first();
    }

    public function updateAboutUs(array $data)
    {
        $aboutUs = AboutUs::first();
        
        if ($aboutUs) {
            $aboutUs->update($data);
        } else {
            $aboutUs = AboutUs::create($data);
        }
        
        return $aboutUs;
    }

    // Privacy Policy
    public function getPrivacyPolicy()
    {
        return PrivacyPolicy::firstOrCreate([], [
            'title' => 'PRIVACY POLICY',
            'slogan' => 'PNE HOMES PRIVACY POLICY',
            'description' => '',
            'cover_image_id' => '',
            'contact_title' => 'Contact Us Today',
            'contact_message' => 'I would like to learn more about PNE Homes\' privacy policy and how my personal information is handled.',
        ]);
    }

    public function updatePrivacyPolicy(array $data)
    {
        $privacyPolicy = $this->getPrivacyPolicy();
        $privacyPolicy->update($data);
        
        return $privacyPolicy;
    }
}
