<?php
/**
 * Plugin Name: TGK Doctor Copy
 * Description: افزونه اولیه دکتر کپی برای دریافت نمونه چاپ و اتصال امن به موتور عیب‌یابی.
 * Version: 0.1.0
 * Requires at least: 6.2
 * Requires PHP: 7.4
 * Author: TGK
 * Text Domain: tgk-doctor-copy
 */

if (!defined('ABSPATH')) {
    exit;
}

final class TGK_Doctor_Copy {
    const VERSION = '0.1.0';
    const OPTION_ENDPOINT = 'tgkdc_api_endpoint';
    const OPTION_KEY = 'tgkdc_api_key';
    const MAX_BYTES = 4194304; // 4 MiB

    public function __construct() {
        add_shortcode('tgk_doctor_copy', [$this, 'render_shortcode']);
        add_action('admin_menu', [$this, 'admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function admin_menu() {
        add_options_page(
            'تنظیمات دکتر کپی',
            'دکتر کپی',
            'manage_options',
            'tgk-doctor-copy',
            [$this, 'settings_page']
        );
    }

    public function register_settings() {
        register_setting('tgkdc_settings', self::OPTION_ENDPOINT, [
            'type' => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default' => '',
        ]);
        register_setting('tgkdc_settings', self::OPTION_KEY, [
            'type' => 'string',
            'sanitize_callback' => [$this, 'sanitize_api_key'],
            'default' => '',
        ]);
    }

    public function sanitize_api_key($value) {
        return is_string($value) ? trim(sanitize_text_field($value)) : '';
    }

    public function settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap" dir="rtl">
            <h1>تنظیمات دکتر کپی</h1>
            <p>این نسخه رابط کاربری و اتصال امن را فراهم می‌کند؛ برای تشخیص واقعی باید موتور تحلیل جداگانه پیاده‌سازی و به این افزونه متصل شود.</p>
            <form method="post" action="options.php">
                <?php settings_fields('tgkdc_settings'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="<?php echo esc_attr(self::OPTION_ENDPOINT); ?>">آدرس API موتور عیب‌یابی</label></th>
                        <td>
                            <input class="regular-text" type="url" id="<?php echo esc_attr(self::OPTION_ENDPOINT); ?>" name="<?php echo esc_attr(self::OPTION_ENDPOINT); ?>" value="<?php echo esc_attr(get_option(self::OPTION_ENDPOINT, '')); ?>" placeholder="https://api.example.com/diagnose">
                            <p class="description">تا زمان ساخت موتور عیب‌یابی، این فیلد را خالی بگذارید. فقط از آدرس HTTPS معتبر استفاده کنید.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="<?php echo esc_attr(self::OPTION_KEY); ?>">کلید خصوصی API</label></th>
                        <td>
                            <input class="regular-text" type="password" autocomplete="new-password" id="<?php echo esc_attr(self::OPTION_KEY); ?>" name="<?php echo esc_attr(self::OPTION_KEY); ?>" value="<?php echo esc_attr(get_option(self::OPTION_KEY, '')); ?>">
                            <p class="description">کلید در مرورگر کاربر نمایش داده نمی‌شود. از کلید واقعی در سایت آزمایشی عمومی استفاده نکنید.</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button('ذخیره تنظیمات'); ?>
            </form>
        </div>
        <?php
    }

    public function render_shortcode() {
        $nonce = wp_create_nonce('wp_rest');
        $endpoint = esc_url_raw(rest_url('tgk-doctor-copy/v1/diagnose'));
        ob_start();
        ?>
        <section class="tgkdc" dir="rtl" data-endpoint="<?php echo esc_attr($endpoint); ?>" data-nonce="<?php echo esc_attr($nonce); ?>">
            <style>
                .tgkdc{max-width:760px;margin:24px auto;padding:24px;border:1px solid #dedee5;border-radius:18px;background:#fff;color:#20202a;font-family:inherit}
                .tgkdc *{box-sizing:border-box}.tgkdc h2{margin:0 0 8px;font-size:1.5rem}.tgkdc p{line-height:1.8}
                .tgkdc .tgkdc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
                .tgkdc label{display:block;font-weight:600;margin:12px 0 6px}.tgkdc input,.tgkdc select,.tgkdc textarea{width:100%;padding:11px;border:1px solid #c9c9d2;border-radius:9px;background:#fff;color:#222}
                .tgkdc .tgkdc-submit{margin-top:18px;background:#29213f;color:#fff;border:0;border-radius:10px;padding:12px 18px;cursor:pointer;font-weight:700}
                .tgkdc .tgkdc-submit:disabled{opacity:.6;cursor:wait}.tgkdc .tgkdc-status{margin-top:16px;padding:12px;border-radius:10px;background:#f5f4f8;white-space:pre-wrap}
                .tgkdc .tgkdc-result{margin-top:12px;line-height:1.9}.tgkdc .tgkdc-result ul{padding-right:22px}
                @media(max-width:560px){.tgkdc .tgkdc-grid{grid-template-columns:1fr}.tgkdc{padding:16px}}
            </style>
            <h2>دکتر کپی | دستیار عیب‌یابی چاپ</h2>
            <p>تصویر یک برگه چاپ‌شده را ارسال کنید تا پس از اتصال موتور تحلیل، نشانه‌های احتمالی بررسی شوند. نتیجه نرم‌افزار جایگزین بررسی تکنسین نیست.</p>
            <form class="tgkdc-form">
                <div class="tgkdc-grid">
                    <div>
                        <label for="tgkdc-brand">برند دستگاه</label>
                        <select id="tgkdc-brand" name="brand" required>
                            <option value="">انتخاب کنید</option>
                            <option>Canon</option><option>Ricoh</option><option>Konica Minolta</option>
                            <option>Sharp</option><option>Toshiba</option><option>Kyocera</option><option>HP</option><option>Xerox</option><option>سایر</option>
                        </select>
                    </div>
                    <div>
                        <label for="tgkdc-model">مدل دستگاه (در صورت اطلاع)</label>
                        <input id="tgkdc-model" name="model" type="text" maxlength="120" placeholder="مثلاً imageRUNNER ...">
                    </div>
                </div>
                <label for="tgkdc-symptoms">شرح مشکل (اختیاری)</label>
                <textarea id="tgkdc-symptoms" name="symptoms" rows="3" maxlength="1200" placeholder="مثلاً خطوط عمودی، لکه تکرارشونده یا سایه روی کاغذ"></textarea>
                <label for="tgkdc-image">تصویر برگه چاپ‌شده (JPG، PNG یا WebP؛ حداکثر ۴ مگابایت)</label>
                <input id="tgkdc-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required>
                <button class="tgkdc-submit" type="submit">بررسی نمونه چاپ</button>
                <div class="tgkdc-status" role="status" aria-live="polite">موتور تشخیص هنوز پیکربندی نشده است؛ این نسخه برای آماده‌سازی و آزمون اتصال است.</div>
                <div class="tgkdc-result" hidden></div>
            </form>
            <script>
            (function(){
                const root = document.currentScript.closest('.tgkdc');
                if (!root || root.dataset.initialized === '1') return;
                root.dataset.initialized = '1';
                const form = root.querySelector('.tgkdc-form');
                const button = root.querySelector('.tgkdc-submit');
                const status = root.querySelector('.tgkdc-status');
                const result = root.querySelector('.tgkdc-result');
                form.addEventListener('submit', async function(event){
                    event.preventDefault();
                    result.hidden = true;
                    const file = form.querySelector('[name="image"]').files[0];
                    if (!file) { status.textContent = 'لطفاً تصویر برگه چاپ را انتخاب کنید.'; return; }
                    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 4194304) {
                        status.textContent = 'فایل باید JPG، PNG یا WebP و حداکثر ۴ مگابایت باشد.'; return;
                    }
                    const data = new FormData(form);
                    button.disabled = true;
                    status.textContent = 'در حال ارسال امن درخواست…';
                    try {
                        const response = await fetch(root.dataset.endpoint, {
                            method: 'POST',
                            headers: {'X-WP-Nonce': root.dataset.nonce},
                            body: data,
                            credentials: 'same-origin'
                        });
                        const payload = await response.json();
                        if (!response.ok) throw new Error(payload.message || 'درخواست انجام نشد.');
                        status.textContent = payload.message || 'بررسی انجام شد.';
                        if (payload.diagnosis) {
                            result.replaceChildren();
                            const heading = document.createElement('strong');
                            heading.textContent = 'نتیجه اولیه';
                            result.appendChild(heading);
                            const summary = document.createElement('p');
                            summary.textContent = payload.diagnosis.summary || 'خلاصه‌ای ارائه نشده است.';
                            result.appendChild(summary);
                            if (Array.isArray(payload.diagnosis.possible_causes) && payload.diagnosis.possible_causes.length) {
                                const list = document.createElement('ul');
                                payload.diagnosis.possible_causes.forEach(function(item){
                                    const li = document.createElement('li');
                                    li.textContent = String(item);
                                    list.appendChild(li);
                                });
                                result.appendChild(list);
                            }
                            result.hidden = false;
                        }
                    } catch (error) {
                        status.textContent = error.message || 'خطای ارتباط رخ داد.';
                    } finally {
                        button.disabled = false;
                    }
                });
            })();
            </script>
        </section>
        <?php
        return ob_get_clean();
    }

    public function register_routes() {
        register_rest_route('tgk-doctor-copy/v1', '/diagnose', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [$this, 'handle_diagnosis'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function handle_diagnosis(WP_REST_Request $request) {
        $nonce = $request->get_header('X-WP-Nonce');
        if (!$nonce || !wp_verify_nonce($nonce, 'wp_rest')) {
            return new WP_Error('tgkdc_invalid_nonce', 'نشست فرم معتبر نیست. صفحه را تازه‌سازی کنید و دوباره تلاش کنید.', ['status' => 403]);
        }

        $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : 'unknown';
        $rate_key = 'tgkdc_rate_' . hash('sha256', $ip);
        $count = (int) get_transient($rate_key);
        if ($count >= 5) {
            return new WP_Error('tgkdc_rate_limit', 'تعداد درخواست‌ها زیاد است؛ لطفاً یک ساعت دیگر دوباره تلاش کنید.', ['status' => 429]);
        }

        $files = $request->get_file_params();
        if (empty($files['image']) || !empty($files['image']['error'])) {
            return new WP_Error('tgkdc_missing_image', 'تصویر معتبر دریافت نشد.', ['status' => 400]);
        }
        $file = $files['image'];
        if (empty($file['size']) || $file['size'] > self::MAX_BYTES || !is_uploaded_file($file['tmp_name'])) {
            return new WP_Error('tgkdc_invalid_image', 'حجم تصویر باید کمتر از ۴ مگابایت باشد.', ['status' => 400]);
        }
        $checked = wp_check_filetype_and_ext($file['tmp_name'], $file['name']);
        $allowed = ['image/jpeg', 'image/png', 'image/webp'];
        $mime = isset($checked['type']) ? $checked['type'] : '';
        if (!in_array($mime, $allowed, true)) {
            return new WP_Error('tgkdc_invalid_type', 'فقط فایل JPG، PNG یا WebP مجاز است.', ['status' => 400]);
        }

        $brand = sanitize_text_field((string) $request->get_param('brand'));
        $model = sanitize_text_field((string) $request->get_param('model'));
        $symptoms = sanitize_textarea_field((string) $request->get_param('symptoms'));
        if ($brand === '') {
            return new WP_Error('tgkdc_missing_brand', 'برند دستگاه را انتخاب کنید.', ['status' => 400]);
        }

        $endpoint = trim((string) get_option(self::OPTION_ENDPOINT, ''));
        $api_key = trim((string) get_option(self::OPTION_KEY, ''));
        if (!$endpoint || !$api_key || !wp_http_validate_url($endpoint) || strtolower((string) wp_parse_url($endpoint, PHP_URL_SCHEME)) !== 'https') {
            return new WP_Error('tgkdc_engine_not_configured', 'رابط افزونه آماده است، اما موتور عیب‌یابی هنوز متصل نشده است.', ['status' => 503]);
        }

        $image_data = file_get_contents($file['tmp_name']);
        if ($image_data === false) {
            return new WP_Error('tgkdc_read_error', 'خواندن تصویر ناموفق بود.', ['status' => 400]);
        }

        set_transient($rate_key, $count + 1, HOUR_IN_SECONDS);
        $body = [
            'brand' => $brand,
            'model' => $model,
            'symptoms' => $symptoms,
            'image_mime' => $mime,
            'image_base64' => base64_encode($image_data),
        ];

        $response = wp_remote_post($endpoint, [
            'timeout' => 45,
            'redirection' => 0,
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $api_key,
            ],
            'body' => wp_json_encode($body),
            'data_format' => 'body',
        ]);

        if (is_wp_error($response)) {
            return new WP_Error('tgkdc_upstream_error', 'ارتباط با موتور عیب‌یابی برقرار نشد.', ['status' => 502]);
        }
        $status_code = (int) wp_remote_retrieve_response_code($response);
        $decoded = json_decode(wp_remote_retrieve_body($response), true);
        if ($status_code < 200 || $status_code >= 300 || !is_array($decoded)) {
            return new WP_Error('tgkdc_bad_upstream_response', 'موتور عیب‌یابی پاسخ معتبر نداد.', ['status' => 502]);
        }

        $summary = isset($decoded['summary']) ? sanitize_textarea_field($decoded['summary']) : '';
        $causes = [];
        if (!empty($decoded['possible_causes']) && is_array($decoded['possible_causes'])) {
            foreach (array_slice($decoded['possible_causes'], 0, 8) as $cause) {
                if (is_string($cause)) {
                    $causes[] = sanitize_text_field($cause);
                }
            }
        }

        return rest_ensure_response([
            'message' => 'تحلیل اولیه دریافت شد. پیش از تعمیر، نتیجه را با بررسی فنی تأیید کنید.',
            'diagnosis' => [
                'summary' => $summary,
                'possible_causes' => $causes,
            ],
        ]);
    }
}

new TGK_Doctor_Copy();
