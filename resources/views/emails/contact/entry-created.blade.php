@php
    /** @var \App\Models\ContactEntry $entry */
    $title = 'New Contact Entry';

    // Brand palette (light mode only)
    $textPrimary = '#0F172A'; // slate-900
    $textMuted   = '#64748B'; // slate-500
    $border      = '#E2E8F0'; // slate-200
    $bg          = '#F8FAFC'; // slate-50
    $cardBg      = '#FFFFFF'; // white
    $badgeBg     = '#EEF2FF'; // indigo-50
    $badgeText   = '#3730A3'; // indigo-800
    $buttonBg    = '#111827'; // neutral-900
    $buttonText  = '#FFFFFF'; // white

    $appName = $appName ?? config('app.name');
    $appUrl  = $appUrl ?? config('app.url');
    $adminUrl = url('/admin/contact-entries');
@endphp
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting">
    <title>{{ $title }}</title>
    <!-- Keep CSS extremely small and safe for email clients -->
    <style>
        /* Progressive enhancement for a subtle card shadow in clients that allow it */
        .card {
            box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(15,23,42,0.06);
        }
        @media (max-width: 600px) {
            .container { padding: 16px !important; }
            .card { padding: 16px !important; }
            .facts td { display:block; width:100% !important; padding:10px 0 !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;background: {{ $bg }}; font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji','Segoe UI Emoji'; color: {{ $textPrimary }};">
    <!-- Preview text (hidden in most clients) -->
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
        New contact entry from {{ $entry->full_name }} — {{ $entry->email }}
    </span>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: {{ $bg }}; padding: 28px 0;">
        <tr>
            <td align="center">
                <table class="container" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; width: 100%; padding: 0 24px;">
                    <!-- Header -->
                    <tr>
                        <td align="left" style="padding-bottom: 18px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="left" style="font-weight:700; font-size: 18px; color: {{ $textPrimary }};">
                                        {{ $appName }}
                                    </td>
                                    <td align="right" style="font-size:12px; color: {{ $textMuted }};">
                                        {{ $entry->created_at->format('M d, Y H:i') }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                        <td>
                            <table class="card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: {{ $cardBg }}; border:1px solid {{ $border }}; border-radius: 14px; padding: 24px;">
                                <!-- Badge + Title -->
                                <tr>
                                    <td style="padding-bottom: 8px;">
                                        <span style="display:inline-block; padding:6px 12px; border-radius:9999px; background: {{ $badgeBg }}; color: {{ $badgeText }}; font-size: 12px; font-weight: 600;">
                                            Contact Entry
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 4px;">
                                        <h1 style="margin: 0; font-size: 22px; line-height: 1.35; color: {{ $textPrimary }};">
                                            New submission from {{ $entry->full_name }}
                                        </h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 14px;">
                                        <div style="font-size: 14px; color: {{ $textMuted }};">
                                            A visitor submitted the contact form on your website.
                                        </div>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td>
                                        <div style="height:1px; background: {{ $border }}; line-height:1px; font-size:0;"></div>
                                    </td>
                                </tr>

                                <!-- Key facts grid (2 columns on desktop, stacked on mobile) -->
                                <tr>
                                    <td style="padding: 4px 0;">
                                        <table class="facts" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0 0;">
                                            <tr>
                                                <td valign="top" width="50%" style="padding:14px 8px 8px 0;">
                                                    <div style="font-size:12px; color: {{ $textMuted }}; margin-bottom: 2px;">Email</div>
                                                    <div style="font-size:14px; color: {{ $textPrimary }};">{{ $entry->email }}</div>
                                                </td>
                                                <td valign="top" width="50%" style="padding:14px 0 8px 8px;">
                                                    <div style="font-size:12px; color: {{ $textMuted }}; margin-bottom: 2px;">Phone</div>
                                                    <div style="font-size:14px; color: {{ $textPrimary }};">{{ $entry->phone_number }}</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td valign="top" width="50%" style="padding:10px 8px 0 0; border-top: 1px solid {{ $border }};">
                                                    <div style="font-size:12px; color: {{ $textMuted }}; margin-bottom: 2px;">Land Area (sqft)</div>
                                                    <div style="font-size:14px; color: {{ $textPrimary }};">{{ $entry->land_area_sqft ?? 'Not provided' }}</div>
                                                </td>
                                                <td valign="top" width="50%" style="padding:10px 0 0 8px; border-top: 1px solid {{ $border }};">
                                                    <div style="font-size:12px; color: {{ $textMuted }}; margin-bottom: 2px;">Land Address</div>
                                                    <div style="font-size:14px; color: {{ $textPrimary }};">{{ $entry->land_address ?? 'Not provided' }}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Message block -->
                                <tr>
                                    <td style="padding-top:16px;">
                                        <div style="font-size:12px; color: {{ $textMuted }}; margin-bottom: 8px;">Message</div>
                                        <div style="border:1px solid {{ $border }}; border-radius:10px; padding:12px; font-size:14px; line-height:1.6; color: {{ $textPrimary }}; background:#FCFCFD;">
                                            {!! nl2br(e($entry->message)) !!}
                                        </div>
                                    </td>
                                </tr>

                                <!-- CTA row -->
                                <tr>
                                    <td style="padding-top:20px;">
                                        <!-- Bulletproof button -->
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" bgcolor="{{ $buttonBg }}" style="border-radius:10px;">
                                                    <a href="{{ $adminUrl }}"
                                                       style="display:inline-block; padding:12px 18px; font-size:14px; font-weight:700; text-decoration:none; color: {{ $buttonText }}; background: {{ $buttonBg }}; border-radius:10px;">
                                                        Open in Dashboard
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Tiny help text -->
                                <tr>
                                    <td style="padding-top:14px;">
                                        <div style="font-size:12px; color: {{ $textMuted }};">
                                            You’re receiving this email because notifications are enabled for contact submissions.
                                        </div>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding-top: 16px;">
                            <div style="text-align:center; font-size:12px; color: {{ $textMuted }};">
                                © {{ now()->year }} {{ $appName }}
                                @if($appUrl)
                                    — <a href="{{ $appUrl }}" style="color: {{ $textMuted }}; text-decoration: underline;">
                                        {{ parse_url($appUrl, PHP_URL_HOST) }}
                                    </a>
                                @endif
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
