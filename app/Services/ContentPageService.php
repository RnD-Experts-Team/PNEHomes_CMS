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
        return PrivacyPolicy::first();
    }

    public function updatePrivacyPolicy(array $data)
    {
        $privacyPolicy = PrivacyPolicy::first();
        
        if ($privacyPolicy) {
            $privacyPolicy->update($data);
        } else {
            $privacyPolicy = PrivacyPolicy::create($data);
        }
        
        return $privacyPolicy;
    }
}
