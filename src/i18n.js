import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "shop": "Shop",
                    "login": "Login",
                    "signup": "Sign Up",
                    "home": "Home",
                    "cart": "Cart",
                    "orders": "Orders",
                    "profile": "Profile",
                    "logout": "Logout",
                    "search_placeholder": "Search products...",
                    "categories": "Categories",
                    "featured_products": "Featured Products",
                    "add_to_cart": "Add to Cart",
                    "out_of_stock": "Out of Stock",
                    "total": "Total",
                    "checkout": "Checkout",
                    "no_orders": "You have no orders yet.",
                    "welcome": "Welcome SynchShop",
                    "all_categories": "All Categories",
                    "min_price": "Min Price",
                    "max_price": "Max Price",
                    "address": "Shipping Address",
                    "payment": "Payment Method",
                    "confirm": "Confirm Order",
                    "rating": "Rating",
                    "comment": "Comment",
                    "submit_review": "Submit Review",
                    "verified_buyer": "Verified Buyer",
                    "items_in_stock": "items in stock",
                    "back_to_shop": "Back to Shop",
                    "order_details": "Order Details",
                    "order_id": "Order ID",
                    "status": "Status",
                    "amount": "Amount"
                }
            },
            sw: {
                translation: {
                    "shop": "Duka",
                    "login": "Ingia",
                    "signup": "Jisajili",
                    "home": "Nyumbani",
                    "cart": "Toroli",
                    "orders": "Oda",
                    "profile": "Wasifu",
                    "logout": "Ondoka",
                    "search_placeholder": "Tafuta bidhaa...",
                    "categories": "Jamii",
                    "featured_products": "Bidhaa Maalum",
                    "add_to_cart": "Weka kwenye Toroli",
                    "out_of_stock": "Imeisha",
                    "total": "Jumla",
                    "checkout": "Lipia",
                    "no_orders": "Huna oda yoyote bado.",
                    "welcome": "Karibu SynchShop",
                    "all_categories": "Jamii Zote",
                    "min_price": "Bei ya Chini",
                    "max_price": "Bei ya Juu",
                    "address": "Anwani ya Usafirishaji",
                    "payment": "Njia ya Malipo",
                    "confirm": "Thibitisha Oda",
                    "rating": "Daraja",
                    "comment": "Maoni",
                    "submit_review": "Tuma Maoni",
                    "verified_buyer": "Mnunuzi wa Uhakika",
                    "items_in_stock": "bidhaa zilizopo",
                    "back_to_shop": "Rudi Dukani",
                    "order_details": "Maelezo ya Oda",
                    "order_id": "Namba ya Oda",
                    "status": "Hali",
                    "amount": "Kiasi"
                }
            }
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
