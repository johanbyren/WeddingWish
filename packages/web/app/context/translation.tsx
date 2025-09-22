import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth';

// Translation types
type Language = 'en' | 'sv';
type TranslationKey = string;

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.create': 'Create',
    'nav.gifts': 'Gifts',
    
    // Home page
    'home.login': 'Login',
    'home.register': 'Register',
    'home.logout': 'Logout',
    'home.title': 'Create Your Perfect Wedding Registry',
    'home.subtitle': 'Let your guests contribute to the gifts that matter most to you. Create your wedding page in minutes.',
    'home.dashboard': 'Your Dashboard',
    'home.getStarted': 'Get Started',
    'home.learnMore': 'Learn More',
    'home.createPage': 'Create Your Wedding Page',
    'home.createPageDesc': 'Customize your wedding page with photos, your story, and event details.',
    'home.addWishlist': 'Add Your Wishlist',
    'home.addWishlistDesc': 'Add items like wedding dress, rings, honeymoon expenses, and more to your registry.',
    'home.receiveContributions': 'Receive Contributions',
    'home.receiveContributionsDesc': 'Guests can easily contribute to the gifts that matter most to you.',
    'home.copyright': '© 2025 Our Dream Day. All rights reserved.',
    'home.terms': 'Terms of Service',
    'home.privacy': 'Privacy',
    
    // Learn More page
    'learnMore.hero.title': 'Make your wedding dreams come true — together with your guests',
    'learnMore.hero.subtitle': 'Let your guests contribute to meaningful gifts instead of buying random stuff. Create your dream wedding registry where every contribution matters.',
    'learnMore.hero.createButton': 'Create your wedding page',
    'learnMore.hero.backButton': 'Back to Home',
    
    'learnMore.howItWorks.title': 'How it works',
    'learnMore.howItWorks.step1.title': 'Create your page',
    'learnMore.howItWorks.step1.description': 'Couples create a personal wedding page with photos and their story.',
    'learnMore.howItWorks.step2.title': 'Add gift goals', 
    'learnMore.howItWorks.step2.description': 'Add meaningful gifts like honeymoon, dress, or new home furniture.',
    'learnMore.howItWorks.step3.title': 'Guests contribute',
    'learnMore.howItWorks.step3.description': 'Guests contribute directly with Swish or card — no login required.',
    'learnMore.howItWorks.step4.title': 'Receive money',
    'learnMore.howItWorks.step4.description': 'Couples receive the money directly, easy and transparent.',
    
    'learnMore.benefits.title': 'Why Our Dream Day?',
    'learnMore.benefits.noAwkward.title': 'No awkward gifts',
    'learnMore.benefits.noAwkward.description': 'Every contribution matters — no more random gifts you don\'t need.',
    'learnMore.benefits.transparent.title': '100% transparent',
    'learnMore.benefits.transparent.description': 'Guests know exactly what they\'re supporting and where their money goes.',
    'learnMore.benefits.easyForGuests.title': 'Easy for guests',
    'learnMore.benefits.easyForGuests.description': 'No login required — just pay and send love with a few clicks.',
    'learnMore.benefits.fairPricing.title': 'Fair pricing',
    'learnMore.benefits.fairPricing.description': 'Couples only pay a small fee if they actually receive contributions.',
    
    'learnMore.trust.title': 'Trust & legal transparency',
    'learnMore.trust.subtitle': 'Safe, secure, and legally compliant in Sweden',
    'learnMore.trust.explanation': 'In Sweden, donations are regulated. That\'s why we designed Our Dream Day so that payments go directly from guests to couples, safely and legally. No middleman handling the money.',
    'learnMore.trust.swish': 'Swish integration',
    'learnMore.trust.encrypted': 'Encrypted payments',
    'learnMore.trust.secure': 'Secure & safe',
    
    'learnMore.testimonials.title': 'What couples say',
    'learnMore.testimonials.quote1': 'We used Our Dream Day for our wedding — guests loved it, and we could put the money toward our dream honeymoon.',
    'learnMore.testimonials.author1': 'Anna & Erik, Stockholm',
    'learnMore.testimonials.quote2': 'Finally, a way for our guests to contribute to something we actually wanted. No more toasters we don\'t need!',
    'learnMore.testimonials.author2': 'Maria & Johan, Göteborg',
    
    'learnMore.social.title': 'Follow our journey',
    'learnMore.social.description': 'Stay updated with tips, success stories, and wedding inspiration.',
    'learnMore.social.twitter': 'Follow us on X (Twitter)',
    
    'learnMore.cta.title': 'Ready to create your wedding page?',
    'learnMore.cta.subtitle': 'It only takes 2 minutes — and it\'s free to start.',
    'learnMore.cta.createButton': 'Create your page',
    'learnMore.cta.homeButton': 'Back to Home',
    
    'learnMore.footer.copyright': '© 2025 Our Dream Day. All rights reserved.',
    
    // Register page
    'register.title': 'Create an account',
    'register.subtitle': 'Enter your information to get started',
    'register.firstName': 'First Name',
    'register.firstNamePlaceholder': 'Joe',
    'register.lastName': 'Last Name',
    'register.lastNamePlaceholder': 'Doe',
    'register.email': 'Email',
    'register.emailPlaceholder': 'you@example.com',
    'register.submit': 'Register',
    'register.alreadyHaveAccount': 'Already have an account?',
    'register.login': 'Login',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.pickDate': 'Pick a date',
    
    // Wedding
    'wedding.title': 'Wedding Title',
    'wedding.date': 'Wedding Date',
    'wedding.location': 'Location',
    'wedding.story': 'Wedding Story',
    'wedding.photos': 'Photos',
    'wedding.gifts': 'Gifts',
    'wedding.create': 'Create Wedding Page',
    'wedding.edit': 'Edit Wedding Page',
    'wedding.view': 'View Page',
    'wedding.contribute': 'Contribute',
    'wedding.thankYou': 'Thank You',
    
    // Payment
    'payment.method': 'Payment Method',
    'payment.stripe': 'Stripe',
    'payment.swish': 'Swish',
    'payment.amount': 'Amount',
    'payment.contribute': 'Contribute',
    'payment.thankYou': 'Thank you for your contribution!',
    'payment.swishInstructions': 'Follow the payment instructions to complete your contribution via Swish.',
    'payment.stripeInstructions': 'Your payment is encrypted and securely processed. We never store your card details.',
    
    // Settings
    'settings.title': 'Settings',
    'settings.account': 'Account',
    'settings.payment': 'Payment',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.saveAll': 'Save All',
    'settings.saveAccount': 'Save Account',
    'settings.savePayment': 'Save Payment',
    'settings.saveNotifications': 'Save Notifications',
    'settings.savePrivacy': 'Save Privacy',
    'settings.saveLanguage': 'Save Language',
    
    // Gifts
    'gifts.title': 'Gift Registry',
    'gifts.add': 'Add Gift',
    'gifts.edit': 'Edit Gift',
    'gifts.price': 'Price',
    'gifts.description': 'Description',
    'gifts.image': 'Image',
    'gifts.totalContributed': 'Total Contributed',
    'gifts.progress': 'Progress',
    'gifts.fullyFunded': 'Fully Funded!',
    
    // Forms
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.message': 'Message',
    'form.optional': 'Optional',
    'form.required': 'Required',
    
    // Messages
    'message.weddingCreated': 'Wedding page created successfully!',
    'message.weddingUpdated': 'Wedding page updated successfully!',
    'message.giftAdded': 'Gift added successfully!',
    'message.giftUpdated': 'Gift updated successfully!',
    'message.giftDeleted': 'Gift deleted successfully!',
    'message.settingsSaved': 'Settings saved successfully!',
    'message.contributionReceived': 'Thank you! Your contribution has been received.',
    
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.weddingDetails': 'Wedding Details',
    'dashboard.giftRegistry': 'Gift Registry',
    'dashboard.createWedding': 'Create Wedding',
    'dashboard.settings': 'Settings',
    'dashboard.logout': 'Logout',
    'dashboard.noWedding': 'No wedding found',
    'dashboard.createFirst': 'Create your first wedding page',
    'dashboard.weddingTitle': 'Wedding Title',
    'dashboard.weddingDate': 'Wedding Date',
    'dashboard.location': 'Location',
    'dashboard.viewPage': 'View Page',
    'dashboard.edit': 'Edit',
    'dashboard.createWeddingPage': 'Create Wedding Page',
    'dashboard.yourWeddingPage': 'Your Wedding Page',
    'dashboard.manageWeddingDetails': 'Manage your wedding page details.',
    'dashboard.untitledWedding': 'Untitled Wedding',
    'dashboard.createdOn': 'Created on',
    'dashboard.weddingDateLabel': 'Wedding Date:',
    'dashboard.locationLabel': 'Location:',
    'dashboard.delete': 'Delete',
    'dashboard.noWeddingPageYet': 'No Wedding Page Yet',
    'dashboard.createWeddingPageToGetStarted': 'Create your wedding page to get started',
    'dashboard.startByCreatingWeddingPage': 'Start by creating your wedding page to share with your guests',
    'dashboard.confirmDeleteWedding': 'Are you sure you want to delete this wedding page? This action cannot be undone.',
    'dashboard.failedToDeleteWedding': 'Failed to delete wedding. Please try again.',
    
    // Create Wedding Page
    'create.title': 'Create Your Wedding Page',
    'create.editTitle': 'Edit Your Wedding Page',
    'create.backToDashboard': 'Back to Dashboard',
    'create.weddingDetails': 'Wedding Details',
    'create.weddingSettings': 'Wedding Settings',
    'create.weddingPhotos': 'Wedding Photos',
    'create.giftRegistry': 'Gift Registry',
    'create.preview': 'Preview',
    'create.fillBasicInfo': 'Fill in the basic information about your wedding to create your page.',
    'create.customizeAppearance': 'Customize how your wedding page appears',
    'create.uploadPhotos': 'Upload photos for your wedding page.',
    'create.addGiftItems': 'Add items to your gift registry that guests can contribute to.',
    'create.previewDescription': 'This is how your wedding page will look to your guests.',
    'create.coverPhoto': 'Cover Photo',
    'create.additionalPhotos': 'Additional Photos',
    'create.public': 'Public',
    'create.private': 'Private',
    'create.theme': 'Theme',
    'create.romantic': 'Romantic',
    'create.addNewGift': 'Add New Gift Item',
    'create.giftDescription': 'Gift Description',
    'create.giftPrice': 'Gift Price',
    'create.uploadImage': 'Upload Image',
    'create.removeImage': 'Remove Image',
    'create.addGift': 'Add Gift',
    'create.updateGift': 'Update Gift',
    'create.cancel': 'Cancel',
    'create.saving': 'Saving...',
    'create.creating': 'Creating...',
    'create.updating': 'Updating...',
    'create.createWeddingPage': 'Create Wedding Page',
    'create.createWedding': 'Create Wedding',
    'create.editWedding': 'Edit Wedding',
    'create.updateWeddingPage': 'Update Wedding Page',
    'create.nextPhotos': 'Next: Photos',
    'create.nextGifts': 'Next: Gifts',
    'create.nextPreview': 'Next: Preview',
    'create.back': 'Back',
    
    // Wedding Details Tab
    'create.weddingTitle': 'Wedding Title',
    'create.weddingTitlePlaceholder': 'John & Jane\'s Wedding',
    'create.weddingDate': 'Wedding Date',
    'create.weddingTime': 'Wedding Time',
    'create.weddingLocation': 'Wedding Location',
    'create.weddingLocationPlaceholder': 'Venue name and address',
    'create.loveStory': 'Your Love Story',
    'create.loveStoryPlaceholder': 'Share your journey together...',
    
    // Wedding Settings Tab
    'create.pageVisibility': 'Page Visibility',
    'create.publicVisibility': 'Public - Anyone with the link can view',
    'create.passwordVisibility': 'Password Protected - Guests need a password',
    'create.privateVisibility': 'Private - Only you can view',
    'create.checking': 'Checking...',
    'create.customizeWeddingPage': 'Customize how your wedding page appears',
    'create.customUrl': 'Custom URL',
    'create.customUrlDescription': 'Choose a unique URL for your wedding page',
    'create.urlAvailable': 'URL is available',
    'create.urlTaken': 'This URL is already taken',
    'create.urlCheckError': 'Error checking URL availability',
    'create.pageTheme': 'Page Theme',
    'create.selectTheme': 'Select theme',
    'create.classic': 'Classic',
    'create.romanticClassic': 'Romantic Classic',
    'create.elegantGarden': 'Elegant Garden',
    'create.vintageRomance': 'Vintage Romance',
    'create.modernMinimalist': 'Modern Minimalist',
    'create.modern': 'Modern',
    'create.primaryColor': 'Primary Color',
    'create.selectColor': 'Select color',
    'create.pink': 'Blush Pink',
    'create.rosePetal': 'Rose Petal',
    'create.lavender': 'Lavender',
    'create.sageGreen': 'Sage Green',
    'create.dustyBlue': 'Dusty Blue',
    'create.vintageGold': 'Vintage Gold',
    'create.deepNavy': 'Deep Navy',
    'create.champagne': 'Champagne',
    'create.mauve': 'Mauve',
    'create.eucalyptus': 'Eucalyptus',
    
    // Gift Registry Tab
    'create.addNewGiftItem': 'Add New Gift Item',
    'create.giftName': 'Gift Name',
    'create.giftNamePlaceholder': 'e.g., Wedding Dress, Honeymoon Fund',
    'create.priceSek': 'Price (sek)',
    'create.description': 'Description',
    'create.giftDescriptionPlaceholder': 'Describe this gift and why it\'s important to you...',
    'create.noImage': 'No image',
    
    // Preview Tab
    'create.previewWeddingPage': 'Preview Your Wedding Page',
    'create.livePreview': 'Live Preview',
    'create.noCoverPhotoSelected': 'No cover photo selected',
    'create.yourWeddingTitle': 'Your Wedding Title',
    'create.ourStory': 'Our Story',
    'create.photoGallery': 'Photo Gallery',
    'create.noGiftItemsAddedYet': 'No gift items added yet.',
    
    // Settings Page
    'settings.accountSettings': 'Account Settings',
    'settings.personalInfo': 'Personal Information',
    'settings.weddingInfo': 'Wedding Information',
    'settings.shippingAddress': 'Shipping Address',
    'settings.paymentMethod': 'Payment Method',
    'settings.accountEmail': 'Account Email',
    'settings.notifyOnContribution': 'Notify on Contribution',
    'settings.autoThankYou': 'Auto Thank You',
    'settings.stripeAccountId': 'Stripe Account ID',
    'settings.swishPhoneNumber': 'Swish Phone Number',
    'settings.emailNotifications': 'Email Notifications',
    'settings.contributionAlerts': 'Contribution Alerts',
    'settings.weeklyDigest': 'Weekly Digest',
    'settings.marketingEmails': 'Marketing Emails',
    'settings.showContributorNames': 'Show Contributor Names',
    'settings.showContributionAmounts': 'Show Contribution Amounts',
    'settings.allowGuestComments': 'Allow Guest Comments',
    'settings.showRegistry': 'Show Registry',
    'settings.street': 'Street',
    'settings.city': 'City',
    'settings.state': 'State',
    'settings.zipCode': 'Zip Code',
    'settings.country': 'Country',
    'settings.countryCode': 'Country Code',
    'settings.phoneNumber': 'Phone Number',
    'settings.partner1Name': 'First Partner',
    'settings.partner2Name': 'Second Partner',
    'settings.weddingDate': 'Wedding Date',
    'settings.enterSwishPhone': 'Enter your private Swish phone number (not a business number).',
    'settings.emailAssociated': 'Email associated with your payment account',
    'settings.forShipping': 'For shipping notifications and important updates',
    'settings.emailCannotBeChanged': 'Email address cannot be changed as it is used as your account identifier',
    'settings.swishPrivatePhone': 'Swish (private phone number)',
    'settings.selectCountry': 'Select country',
    'settings.stripeConnectAccount': 'Stripe Connect Account',
    'settings.setupStripeAccount': 'Set up your Stripe account to receive payments',
    'settings.completeStripeSetup': 'Complete your Stripe account setup',
    'settings.stripeAccountReady': 'Your Stripe account is ready to receive payments',
    'settings.setupStripeButton': 'Set up Stripe Account',
    'settings.stripeAccountConnected': 'Your Stripe account is connected and ready to receive payments',
    'settings.failedToFetch': 'Failed to fetch settings',
    'settings.failedToLoad': 'Failed to load settings. Please try again.',
    'settings.failedToSaveAccount': 'Failed to save account settings',
    'settings.failedToSaveAccountError': 'Failed to save account settings. Please try again.',
    'settings.failedToSaveAll': 'Failed to save all settings',
    'settings.failedToSaveAllError': 'Failed to save settings. Please try again.',
    'settings.failedToSavePayment': 'Failed to save payment settings',
    'settings.failedToSavePaymentError': 'Failed to save payment settings. Please try again.',
    'settings.failedToSaveNotifications': 'Failed to save notification settings',
    'settings.failedToSaveNotificationsError': 'Failed to save notification settings. Please try again.',
    'settings.failedToSavePrivacy': 'Failed to save privacy settings',
    'settings.failedToSavePrivacyError': 'Failed to save privacy settings. Please try again.',
    'settings.failedToSaveLanguage': 'Failed to save language settings',
    'settings.failedToSaveLanguageError': 'Failed to save language settings. Please try again.',
    'settings.failedToStartStripe': 'Failed to start Stripe Connect onboarding',
    'settings.failedToStartStripeError': 'Failed to start Stripe Connect onboarding. Please try again.',
    'settings.displayContributorNames': 'Display the names of people who contribute to your registry',
    'settings.displayContributionAmounts': 'Display how much each person contributed',
    'settings.letGuestsLeaveComments': 'Let guests leave comments on your wedding page',
    'settings.makeRegistryVisible': 'Make your gift registry visible to guests',
    'settings.receiveEmailNotifications': 'Receive notifications via email',
    'settings.getNotifiedOnContribution': 'Get notified when someone contributes to your registry',
    'settings.receiveWeeklySummary': 'Receive a weekly summary of activity',
    'settings.receiveMarketingUpdates': 'Receive updates and offers from Our Dream Day',
    'settings.enterPrivateSwishNumber': 'Enter your private Swish phone number (not a business number).',
    'settings.emailAssociatedWithPayment': 'Email associated with your payment account',
    'settings.receiveEmailOnContribution': 'Receive an email when someone contributes',
    'settings.automaticThankYouEmails': 'Automatic thank you emails',
    'settings.sendAutomaticThankYou': 'Send automatic thank you emails to contributors',
    'settings.contributionSettings': 'Contribution Settings',
    'settings.language': 'Language',
    'settings.languageDescription': 'Choose your preferred language for the application',
    'settings.selectLanguage': 'Select Language',
    
    // Create Wedding Page Additional Keys
    'create.coverPhotoDescription': 'This will be the main image at the top of your wedding page.',
    'create.additionalPhotosDescription': 'Add more photos to your wedding gallery (optional).',
    'create.remove': 'Remove',
    'create.weddingLanguage': 'Wedding Page Language',
    'create.selectLanguage': 'Select Language',
    'create.languageDescription': 'Choose the language for your wedding page',
    'create.english': 'English',
    'create.swedish': 'Swedish',
    'create.confirmRemoveCoverPhoto': 'Are you sure you want to remove the cover photo?',
    'create.confirmRemovePhoto': 'Are you sure you want to remove this photo?',
    'create.addGiftItem': 'Add Gift Item',
    'create.yourGiftRegistry': 'Your Gift Registry',
    'create.noGiftsAdded': 'No gifts added yet. Add your first gift item above.',
    'create.nextWeddingSettings': 'Next: Wedding Settings',
    'create.giftPreview': 'Gift preview',
    'create.coverPreview': 'Cover preview',
    'create.cover': 'Cover',
    'create.previewHeader': 'Preview Header',
    'create.previewContent': 'Preview Content',
    
    // Gift Registry Overview
    'gifts.overview': 'Gift Registry Overview',
    'gifts.giftName': 'Gift Name',
    'gifts.targetAmount': 'Target Amount',
    'gifts.contributed': 'Contributed',
    'gifts.contributors': 'Contributors',
    'gifts.noContributions': 'No contributions yet',
    'gifts.moreContributions': 'more contribution',
    'gifts.moreContributionsPlural': 'more contributions',
    'gifts.percentFunded': 'funded',
    'gifts.saveRegistry': 'Save Registry',
    'gifts.registrySaved': 'Gift registry saved successfully!',
    'gifts.deleting': 'Deleting...',
    'gifts.readOnlyInfo': 'Manage gifts in the Create Wedding page',
    'gifts.deleteItem': 'Delete Gift Item',
    'gifts.saveChanges': 'Save Changes',
    'gifts.noGifts': 'No gifts added yet',
    'gifts.addFirstGift': 'Add your first gift to get started',
    
    // Contribute Page
    'contribute.title': 'Contribute to Gift',
    'contribute.description': 'Help us make our wedding dreams come true by contributing to this gift.',
    'contribute.alreadyContributed': 'Already contributed',
    'contribute.contributionAmount': 'Contribution Amount (SEK)',
    'contribute.yourName': 'Your Name (optional)',
    'contribute.message': 'Message (optional)',
    'contribute.enterYourName': 'Enter your name',
    'contribute.addPersonalMessage': 'Add a personal message',
    'contribute.payNow': 'Pay Now',
    'contribute.showSwishQR': 'Show Swish QR Code',
    'contribute.generatingQR': 'Generating QR Code...',
    'contribute.processing': 'Processing...',
    'contribute.completedSwishPayment': 'I\'ve completed my Swish payment',
    'contribute.scanQRCode': 'Scan the QR code with your Swish app to complete your contribution.',
    'contribute.scanQRCodeWithSwish': 'Scan this QR code with your Swish app to complete your donation.',
    'contribute.phone': 'Phone',
    'contribute.amount': 'Amount',
    'contribute.securePaymentSwish': 'Secure payment via Swish',
    'contribute.securePaymentStripe': 'Secure payment by Stripe',
    'contribute.paymentEncrypted': 'Your payment is encrypted and securely processed. We never store your card details.',
    'contribute.couldNotSaveDonation': 'Could not save your donation. Please try again.',
    'contribute.backToWeddingPage': 'Back to Wedding Page',
    'contribute.giftNotConfigured': 'This gift is not properly configured. Please contact the wedding organizers.',
    'contribute.failedToCreateCheckout': 'Failed to create checkout session',
    'contribute.giftNotFound': 'Gift not found',
    
    // Thank You Page
    'thankYou.title': 'Thank You!',
    'thankYou.description': 'Thank you for your generous contribution to our wedding. Your support means the world to us!',
    'thankYou.contributionProgress': 'Contribution Progress',
    'thankYou.gift': 'Gift',
    'thankYou.progress': 'Progress',
    'thankYou.sekContributed': 'sek contributed',
    'thankYou.sekGoal': 'sek goal',
    'thankYou.fullyFunded': 'Fully Funded!',
    'thankYou.returnToWeddingPage': 'Return to Wedding Page',
    'thankYou.backToHome': 'Back to Home',
    
    // Wedding Page
    'weddingPage.title': 'Wedding Page',
    'weddingPage.date': 'Date',
    'weddingPage.location': 'Location',
    'weddingPage.story': 'Our Story',
    'weddingPage.giftRegistry': 'Gift Registry',
    'weddingPage.contribute': 'Contribute',
    'weddingPage.photoGallery': 'Photo Gallery',
    'weddingPage.giftRegistryDescription': 'Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we have created this registry.',
    'weddingPage.sekOf': 'sek of',
    'weddingPage.sek': 'sek',
    'weddingPage.contributed': 'contributed',
    'weddingPage.goal': 'goal',
    'weddingPage.fullyFunded': 'Fully Funded!',
    'weddingPage.backToHome': 'Back to Home',
    'weddingPage.weddingNotFound': 'Wedding not found',
    'weddingPage.error': 'Error',
    'weddingPage.ourSpecialDay': 'Our Special Day',
    'weddingPage.joinUsDescription': 'Join us as we celebrate our love story and begin this beautiful journey together',
    'weddingPage.when': 'When',
    'weddingPage.ceremony': 'Ceremony',
    'weddingPage.where': 'Where',
    'weddingPage.viewOnMaps': 'View on Google Maps',
    'weddingPage.ourStory': 'Our Story',
    'weddingPage.loveStory': 'Love Story',
    'weddingPage.celebrateWithUs': 'Celebrate with us',
    'weddingPage.ourJourney': 'Our Journey',
    'weddingPage.journeyDescription': 'A glimpse into our love story through the moments that brought us here',
    'weddingPage.thankYou': 'Thank you for being part of our love story',
    'weddingPage.joinUs': 'Join us for our celebration',
    
    'thankYou': 'Thank You',
    
    // Errors and Loading
    'error.somethingWentWrong': 'Something went wrong',
    'error.unexpectedError': 'An unexpected error occurred',
    'error.failedToLoad': 'Failed to load',
    'error.failedToSave': 'Failed to save',
    'error.failedToCreate': 'Failed to create',
    'error.failedToUpdate': 'Failed to update',
    'error.failedToDelete': 'Failed to delete',
    'error.networkError': 'Network error. Please check your connection.',
    'error.unauthorized': 'Unauthorized. Please log in again.',
    'error.notFound': 'Not found',
    'loading.loading': 'Loading...',
    'loading.saving': 'Saving...',
    'loading.creating': 'Creating...',
    'loading.updating': 'Updating...',
    'loading.deleting': 'Deleting...',
    'loading.uploading': 'Uploading...',
    'loading.weddingDetails': 'Loading wedding details...',
    'loading.giftRegistry': 'Loading gift registry...',
    'loading.giftDetails': 'Loading gift details...',
    'loading.settings': 'Loading settings...',
    'loading.settingUp': 'Setting up...',
  },
  sv: {
    // Navigation
    'nav.home': 'Hem',
    'nav.dashboard': 'Instrumentpanel',
    'nav.settings': 'Inställningar',
    'nav.create': 'Skapa',
    'nav.gifts': 'Gåvor',
    
    // Home page
    'home.login': 'Logga in',
    'home.register': 'Registrera',
    'home.logout': 'Logga ut',
    'home.title': 'Skapa din perfekta bröllopslista',
    'home.subtitle': 'Låt dina gäster bidra till gåvorna som betyder mest för er. Skapa din bröllopssida på minuter.',
    'home.dashboard': 'Din instrumentpanel',
    'home.getStarted': 'Kom igång',
    'home.learnMore': 'Läs mer',
    'home.createPage': 'Skapa din bröllopssida',
    'home.createPageDesc': 'Anpassa din bröllopssida med foton, er berättelse och evenemangsdetaljer.',
    'home.addWishlist': 'Lägg till din önskelista',
    'home.addWishlistDesc': 'Lägg till saker som bröllopsklänning, ringar, smekmånadsutgifter och mer till din lista.',
    'home.receiveContributions': 'Ta emot bidrag',
    'home.receiveContributionsDesc': 'Gäster kan enkelt bidra till gåvorna som betyder mest för er.',
    'home.copyright': '© 2025 Our Dream Day. Alla rättigheter förbehållna.',
    'home.terms': 'Användarvillkor',
    'home.privacy': 'Integritet',
    
    // Learn More page (Swedish)
    'learnMore.hero.title': 'Gör era bröllopsdrömmar till verklighet — tillsammans med era gäster',
    'learnMore.hero.subtitle': 'Låt era gäster bidra till meningsfulla gåvor istället för att köpa slumpmässiga saker. Skapa erat drömbröllop där varje bidrag räknas.',
    'learnMore.hero.createButton': 'Skapa er bröllopssida',
    'learnMore.hero.backButton': 'Tillbaka till Hem',
    
    'learnMore.howItWorks.title': 'Så fungerar det',
    'learnMore.howItWorks.step1.title': 'Skapa er sida',
    'learnMore.howItWorks.step1.description': 'Par skapar en personlig bröllopssida med foton och deras berättelse.',
    'learnMore.howItWorks.step2.title': 'Lägg till gåvomål',
    'learnMore.howItWorks.step2.description': 'Lägg till meningsfulla gåvor som smekmånad, bröllopsklänning eller drömlokalen.',
    'learnMore.howItWorks.step3.title': 'Gäster bidrar',
    'learnMore.howItWorks.step3.description': 'Gäster bidrar direkt med Swish eller kort — ingen inloggning krävs.',
    'learnMore.howItWorks.step4.title': 'Ta emot pengar',
    'learnMore.howItWorks.step4.description': 'Bröllopspar får pengarna direkt, enkelt och transparent.',
    
    'learnMore.benefits.title': 'Varför Our Dream Day?',
    'learnMore.benefits.noAwkward.title': 'Inga besvärliga gåvor',
    'learnMore.benefits.noAwkward.description': 'Varje bidrag räknas — inga fler slumpmässiga gåvor ni inte behöver.',
    'learnMore.benefits.transparent.title': '100% transparent',
    'learnMore.benefits.transparent.description': 'Gäster vet exakt vad de stödjer och vart deras pengar går.',
    'learnMore.benefits.easyForGuests.title': 'Enkelt för gäster',
    'learnMore.benefits.easyForGuests.description': 'Ingen inloggning krävs — bara betala och skicka kärlek med några klick.',
    'learnMore.benefits.fairPricing.title': 'Rättvis prissättning',
    'learnMore.benefits.fairPricing.description': 'Par betalar bara en liten avgift om de faktiskt får bidrag.',
    
    'learnMore.trust.title': 'Förtroende & juridisk transparens',
    'learnMore.trust.subtitle': 'Säker och juridiskt kompatibel i Sverige',
    'learnMore.trust.explanation': 'I Sverige är donationer reglerade. Det är därför vi designade Our Dream Day så att betalningar går direkt från gäster till par, säkert och juridiskt. Ingen mellanhand som hanterar pengarna.',
    'learnMore.trust.swish': 'Swish integration',
    'learnMore.trust.encrypted': 'Krypterade betalningar',
    'learnMore.trust.secure': 'Säker & trygg',
    
    'learnMore.testimonials.title': 'Vad par säger',
    'learnMore.testimonials.quote1': 'Vi använde Our Dream Day för vårt bröllop — gästerna älskade det, och vi kunde lägga pengarna på vår drömsmekmånad.',
    'learnMore.testimonials.author1': 'Anna & Erik, Stockholm',
    'learnMore.testimonials.quote2': 'Äntligen ett sätt för våra gäster att bidra till något vi faktiskt ville ha. Inga fler brödrostar vi inte behöver!',
    'learnMore.testimonials.author2': 'Maria & Johan, Göteborg',
    
    'learnMore.social.title': 'Följ vår resa',
    'learnMore.social.description': 'Håll dig uppdaterad med tips, framgångsberättelser och bröllopsinspiration.',
    'learnMore.social.twitter': 'Följ oss på X (Twitter)',
    
    'learnMore.cta.title': 'Redo att skapa er bröllopssida?',
    'learnMore.cta.subtitle': 'Det tar bara 2 minuter — och det är gratis att komma igång.',
    'learnMore.cta.createButton': 'Skapa er bröllopsida',
    'learnMore.cta.homeButton': 'Tillbaka till Hem',
    
    'learnMore.footer.copyright': '© 2025 Our Dream Day. Alla rättigheter förbehållna.',
    
    // Register page
    'register.title': 'Skapa ett konto',
    'register.subtitle': 'Ange din information för att komma igång',
    'register.firstName': 'Förnamn',
    'register.firstNamePlaceholder': 'Anna',
    'register.lastName': 'Efternamn',
    'register.lastNamePlaceholder': 'Andersson',
    'register.email': 'E-post',
    'register.emailPlaceholder': 'du@exempel.se',
    'register.submit': 'Registrera',
    'register.alreadyHaveAccount': 'Har du redan ett konto?',
    'register.login': 'Logga in',
    
    // Common
    'common.save': 'Spara',
    'common.cancel': 'Avbryt',
    'common.edit': 'Redigera',
    'common.delete': 'Ta bort',
    'common.back': 'Tillbaka',
    'common.next': 'Nästa',
    'common.previous': 'Föregående',
    'common.loading': 'Laddar...',
    'common.error': 'Fel',
    'common.success': 'Framgång',
    'common.yes': 'Ja',
    'common.no': 'Nej',
    'common.pickDate': 'Välj ett datum',
    
    // Wedding
    'wedding.title': 'Bröllopstitel',
    'wedding.date': 'Bröllopsdag',
    'wedding.location': 'Plats',
    'wedding.story': 'Bröllopsberättelse',
    'wedding.photos': 'Foton',
    'wedding.gifts': 'Gåvor',
    'wedding.create': 'Skapa bröllopssida',
    'wedding.edit': 'Redigera bröllopssida',
    'wedding.view': 'Visa sida',
    'wedding.contribute': 'Bidra',
    'wedding.thankYou': 'Tack',
    
    // Payment
    'payment.method': 'Betalningsmetod',
    'payment.stripe': 'Stripe',
    'payment.swish': 'Swish',
    'payment.amount': 'Belopp',
    'payment.contribute': 'Bidra',
    'payment.thankYou': 'Tack för ditt bidrag!',
    'payment.swishInstructions': 'Följ betalningsinstruktionerna för att slutföra ditt bidrag via Swish.',
    'payment.stripeInstructions': 'Din betalning är krypterad och säkert bearbetad. Vi lagrar aldrig dina kortuppgifter.',
    
    // Settings
    'settings.title': 'Inställningar',
    'settings.account': 'Konto',
    'settings.payment': 'Betalning',
    'settings.notifications': 'Notifieringar',
    'settings.privacy': 'Integritet',
    'settings.saveAll': 'Spara alla',
    'settings.saveAccount': 'Spara konto',
    'settings.savePayment': 'Spara betalning',
    'settings.saveNotifications': 'Spara notifieringar',
    'settings.savePrivacy': 'Spara integritet',
    'settings.saveLanguage': 'Spara språk',
    
    // Gifts
    'gifts.title': 'Gåvoregister',
    'gifts.add': 'Lägg till gåva',
    'gifts.edit': 'Redigera gåva',
    'gifts.price': 'Pris',
    'gifts.description': 'Beskrivning',
    'gifts.image': 'Bild',
    'gifts.totalContributed': 'Totalt bidragit',
    'gifts.progress': 'Insamlat',
    'gifts.fullyFunded': 'Helt finansierad!',
    
    // Forms
    'form.name': 'Namn',
    'form.email': 'E-post',
    'form.phone': 'Telefon',
    'form.message': 'Meddelande',
    'form.optional': 'Valfritt',
    'form.required': 'Obligatoriskt',
    
    // Messages
    'message.weddingCreated': 'Bröllopssida skapad framgångsrikt!',
    'message.weddingUpdated': 'Bröllopssida uppdaterad framgångsrikt!',
    'message.giftAdded': 'Gåva tillagd framgångsrikt!',
    'message.giftUpdated': 'Gåva uppdaterad framgångsrikt!',
    'message.giftDeleted': 'Gåva borttagen framgångsrikt!',
    'message.settingsSaved': 'Inställningar sparade framgångsrikt!',
    'message.contributionReceived': 'Tack! Ditt bidrag har mottagits.',
    
    
    // Dashboard
    'dashboard.title': 'Instrumentpanel',
    'dashboard.weddingDetails': 'Bröllopsdetaljer',
    'dashboard.giftRegistry': 'Gåvoregister',
    'dashboard.createWedding': 'Skapa bröllop',
    'dashboard.settings': 'Inställningar',
    'dashboard.logout': 'Logga ut',
    'dashboard.noWedding': 'Inget bröllop hittades',
    'dashboard.createFirst': 'Skapa din första bröllopssida',
    'dashboard.weddingTitle': 'Bröllopstitel',
    'dashboard.weddingDate': 'Bröllopsdag',
    'dashboard.location': 'Plats',
    'dashboard.viewPage': 'Visa sida',
    'dashboard.edit': 'Redigera',
    'dashboard.createWeddingPage': 'Skapa bröllopssida',
    'dashboard.yourWeddingPage': 'Din bröllopssida',
    'dashboard.manageWeddingDetails': 'Hantera dina bröllopsdetaljer.',
    'dashboard.untitledWedding': 'Namnlöst bröllop',
    'dashboard.createdOn': 'Skapad den',
    'dashboard.weddingDateLabel': 'Bröllopsdag:',
    'dashboard.locationLabel': 'Plats:',
    'dashboard.delete': 'Ta bort',
    'dashboard.noWeddingPageYet': 'Ingen bröllopssida än',
    'dashboard.createWeddingPageToGetStarted': 'Skapa din bröllopssida för att komma igång',
    'dashboard.startByCreatingWeddingPage': 'Börja med att skapa din bröllopssida för att dela med dina gäster',
    'dashboard.confirmDeleteWedding': 'Är du säker på att du vill ta bort denna bröllopssida? Denna åtgärd kan inte ångras.',
    'dashboard.failedToDeleteWedding': 'Misslyckades med att ta bort bröllopet. Försök igen.',
    
    // Create Wedding Page
    'create.title': 'Skapa din bröllopssida',
    'create.editTitle': 'Redigera din bröllopssida',
    'create.backToDashboard': 'Tillbaka till instrumentpanelen',
    'create.weddingDetails': 'Bröllopsdetaljer',
    'create.weddingSettings': 'Bröllopsinställningar',
    'create.weddingPhotos': 'Bröllopsfoton',
    'create.giftRegistry': 'Gåvoregister',
    'create.preview': 'Förhandsvisning',
    'create.fillBasicInfo': 'Fyll i grundläggande information om ditt bröllop för att skapa din sida.',
    'create.customizeAppearance': 'Anpassa hur din bröllopssida visas',
    'create.uploadPhotos': 'Ladda upp foton för din bröllopssida.',
    'create.addGiftItems': 'Lägg till objekt i ditt gåvoregister som gäster kan bidra till.',
    'create.previewDescription': 'Så här kommer din bröllopssida att se ut för dina gäster.',
    'create.coverPhoto': 'Omslagsfoto',
    'create.additionalPhotos': 'Ytterligare foton',
    'create.public': 'Offentlig',
    'create.private': 'Privat',
    'create.theme': 'Tema',
    'create.romantic': 'Romantisk',
    'create.addNewGift': 'Lägg till ny gåva',
    'create.giftDescription': 'Gåvans beskrivning',
    'create.giftPrice': 'Gåvans pris',
    'create.uploadImage': 'Ladda upp bild',
    'create.removeImage': 'Ta bort bild',
    'create.addGift': 'Lägg till gåva',
    'create.updateGift': 'Uppdatera gåva',
    'create.cancel': 'Avbryt',
    'create.saving': 'Sparar...',
    'create.creating': 'Skapar...',
    'create.updating': 'Uppdaterar...',
    'create.createWeddingPage': 'Skapa bröllopssida',
    'create.createWedding': 'Skapa bröllop',
    'create.editWedding': 'Redigera bröllop',
    'create.updateWeddingPage': 'Uppdatera bröllopssida',
    'create.nextPhotos': 'Nästa: Foton',
    'create.nextGifts': 'Nästa: Gåvor',
    'create.nextPreview': 'Nästa: Förhandsvisning',
    'create.back': 'Tillbaka',
    
    // Wedding Details Tab
    'create.weddingTitle': 'Bröllopstitel',
    'create.weddingTitlePlaceholder': 'John & Janes bröllop',
    'create.weddingDate': 'Bröllopsdag',
    'create.weddingTime': 'Bröllopstid',
    'create.weddingLocation': 'Bröllopsplats',
    'create.weddingLocationPlaceholder': 'Platsnamn och adress',
    'create.loveStory': 'Er kärlekshistoria',
    'create.loveStoryPlaceholder': 'Dela er resa tillsammans...',
    
    // Wedding Settings Tab
    'create.pageVisibility': 'Sidans synlighet',
    'create.publicVisibility': 'Offentlig - Alla med länken kan se',
    'create.passwordVisibility': 'Lösenordsskyddad - Gäster behöver ett lösenord',
    'create.privateVisibility': 'Privat - Endast du kan se',
    'create.checking': 'Kontrollerar...',
    'create.customizeWeddingPage': 'Anpassa hur din bröllopssida visas',
    'create.customUrl': 'Anpassad URL',
    'create.customUrlDescription': 'Välj en unik URL för din bröllopssida',
    'create.urlAvailable': 'URL är tillgänglig',
    'create.urlTaken': 'Denna URL är redan tagen',
    'create.urlCheckError': 'Fel vid kontroll av URL-tillgänglighet',
    'create.pageTheme': 'Sidtema',
    'create.selectTheme': 'Välj tema',
    'create.classic': 'Klassisk',
    'create.romanticClassic': 'Romantisk Klassisk',
    'create.elegantGarden': 'Elegant Trädgård',
    'create.vintageRomance': 'Vintage Romantik',
    'create.modernMinimalist': 'Modern Minimalistisk',
    'create.modern': 'Modern',
    'create.primaryColor': 'Primärfärg',
    'create.selectColor': 'Välj färg',
    'create.pink': 'Rodnad Rosa',
    'create.rosePetal': 'Rosblad',
    'create.lavender': 'Lavendel',
    'create.sageGreen': 'Salviegrön',
    'create.dustyBlue': 'Dammig Blå',
    'create.vintageGold': 'Vintage Guld',
    'create.deepNavy': 'Djup Marinblå',
    'create.champagne': 'Champagne',
    'create.mauve': 'Malva',
    'create.eucalyptus': 'Eukalyptus',
    
    // Gift Registry Tab
    'create.addNewGiftItem': 'Lägg till ny gåva',
    'create.giftName': 'Gåvnamn',
    'create.giftNamePlaceholder': 't.ex., Bröllopsklänning, Smekmånadsfond',
    'create.priceSek': 'Pris (sek)',
    'create.description': 'Beskrivning',
    'create.giftDescriptionPlaceholder': 'Beskriv denna gåva och varför den är viktig för er...',
    'create.noImage': 'Ingen bild',
    
    // Preview Tab
    'create.previewWeddingPage': 'Förhandsvisa din bröllopssida',
    'create.livePreview': 'Live förhandsvisning',
    'create.noCoverPhotoSelected': 'Ingen omslagsbild vald',
    'create.yourWeddingTitle': 'Din bröllopstitel',
    'create.ourStory': 'Vår historia',
    'create.photoGallery': 'Fotogalleri',
    'create.noGiftItemsAddedYet': 'Inga gåvor tillagda än.',
    
    // Settings Page
    'settings.accountSettings': 'Kontoinställningar',
    'settings.personalInfo': 'Personlig information',
    'settings.weddingInfo': 'Bröllopsinformation',
    'settings.shippingAddress': 'Leveransadress',
    'settings.paymentMethod': 'Betalningsmetod',
    'settings.accountEmail': 'Konto-e-post',
    'settings.notifyOnContribution': 'Notifiera vid bidrag',
    'settings.autoThankYou': 'Automatiskt tack',
    'settings.stripeAccountId': 'Stripe-konto-ID',
    'settings.swishPhoneNumber': 'Swish-telefonnummer',
    'settings.emailNotifications': 'E-postnotifieringar',
    'settings.contributionAlerts': 'Bidragsvarningar',
    'settings.weeklyDigest': 'Veckosammanfattning',
    'settings.marketingEmails': 'Marknadsföringse-post',
    'settings.showContributorNames': 'Visa bidragsgivarnas namn',
    'settings.showContributionAmounts': 'Visa bidragsbelopp',
    'settings.allowGuestComments': 'Tillåt gästkommentarer',
    'settings.showRegistry': 'Visa register',
    'settings.street': 'Gata',
    'settings.city': 'Stad',
    'settings.state': 'Län',
    'settings.zipCode': 'Postnummer',
    'settings.country': 'Land',
    'settings.countryCode': 'Landskod',
    'settings.phoneNumber': 'Telefonnummer',
    'settings.partner1Name': 'Första partner',
    'settings.partner2Name': 'Andra partner',
    'settings.weddingDate': 'Bröllopsdag',
    'settings.enterSwishPhone': 'Ange ditt privata Swish-telefonnummer (inte ett företagsnummer).',
    'settings.emailAssociated': 'E-post associerad med ditt betalningskonto',
    'settings.forShipping': 'För leveransnotifieringar och viktiga uppdateringar',
    'settings.emailCannotBeChanged': 'E-postadressen kan inte ändras eftersom den används som ditt konto-ID',
    'settings.swishPrivatePhone': 'Swish (privat telefonnummer)',
    'settings.selectCountry': 'Välj land',
    'settings.stripeConnectAccount': 'Stripe Connect-konto',
    'settings.setupStripeAccount': 'Konfigurera ditt Stripe-konto för att ta emot betalningar',
    'settings.completeStripeSetup': 'Slutför din Stripe-kontokonfiguration',
    'settings.stripeAccountReady': 'Ditt Stripe-konto är redo att ta emot betalningar',
    'settings.setupStripeButton': 'Konfigurera Stripe-konto',
    'settings.stripeAccountConnected': 'Ditt Stripe-konto är anslutet och redo att ta emot betalningar',
    'settings.failedToFetch': 'Misslyckades att hämta inställningar',
    'settings.failedToLoad': 'Misslyckades att ladda inställningar. Försök igen.',
    'settings.failedToSaveAccount': 'Misslyckades att spara kontoinställningar',
    'settings.failedToSaveAccountError': 'Misslyckades att spara kontoinställningar. Försök igen.',
    'settings.failedToSaveAll': 'Misslyckades att spara alla inställningar',
    'settings.failedToSaveAllError': 'Misslyckades att spara inställningar. Försök igen.',
    'settings.failedToSavePayment': 'Misslyckades att spara betalningsinställningar',
    'settings.failedToSavePaymentError': 'Misslyckades att spara betalningsinställningar. Försök igen.',
    'settings.failedToSaveNotifications': 'Misslyckades att spara notifieringsinställningar',
    'settings.failedToSaveNotificationsError': 'Misslyckades att spara notifieringsinställningar. Försök igen.',
    'settings.failedToSavePrivacy': 'Misslyckades att spara integritetsinställningar',
    'settings.failedToSavePrivacyError': 'Misslyckades att spara integritetsinställningar. Försök igen.',
    'settings.failedToSaveLanguage': 'Misslyckades att spara språkinställningar',
    'settings.failedToSaveLanguageError': 'Misslyckades att spara språkinställningar. Försök igen.',
    'settings.failedToStartStripe': 'Misslyckades att starta Stripe Connect onboarding',
    'settings.failedToStartStripeError': 'Misslyckades att starta Stripe Connect onboarding. Försök igen.',
    'settings.displayContributorNames': 'Visa namnen på personer som bidrar till ditt register',
    'settings.displayContributionAmounts': 'Visa hur mycket varje person bidrog',
    'settings.letGuestsLeaveComments': 'Låt gäster lämna kommentarer på din bröllopssida',
    'settings.makeRegistryVisible': 'Gör ditt gåvoregister synligt för gäster',
    'settings.receiveEmailNotifications': 'Ta emot notifieringar via e-post',
    'settings.getNotifiedOnContribution': 'Få notifiering när någon bidrar till ditt register',
    'settings.receiveWeeklySummary': 'Ta emot en veckosammanfattning av aktivitet',
    'settings.receiveMarketingUpdates': 'Ta emot uppdateringar och erbjudanden från Our Dream Day',
    'settings.enterPrivateSwishNumber': 'Ange ditt privata Swish-telefonnummer (inte ett företagsnummer).',
    'settings.emailAssociatedWithPayment': 'E-post associerad med ditt betalningskonto',
    'settings.receiveEmailOnContribution': 'Ta emot ett e-postmeddelande när någon bidrar',
    'settings.automaticThankYouEmails': 'Automatiska tack-e-postmeddelanden',
    'settings.sendAutomaticThankYou': 'Skicka automatiska tack-e-postmeddelanden till bidragsgivare',
    'settings.contributionSettings': 'Bidragsinställningar',
    'settings.language': 'Språk',
    'settings.languageDescription': 'Välj ditt föredragna språk för applikationen',
    'settings.selectLanguage': 'Välj språk',
    
    // Create Wedding Page Additional Keys
    'create.coverPhotoDescription': 'Detta kommer att vara huvudbilden högst upp på din bröllopssida.',
    'create.additionalPhotosDescription': 'Lägg till fler foton i din bröllopsgalleri (valfritt).',
    'create.remove': 'Ta bort',
    'create.weddingLanguage': 'Bröllopssidans språk',
    'create.selectLanguage': 'Välj språk',
    'create.languageDescription': 'Välj språket för din bröllopssida',
    'create.english': 'Engelska',
    'create.swedish': 'Svenska',
    'create.confirmRemoveCoverPhoto': 'Är du säker på att du vill ta bort omslagsbilden?',
    'create.confirmRemovePhoto': 'Är du säker på att du vill ta bort denna bild?',
    'create.addGiftItem': 'Lägg till gåva',
    'create.yourGiftRegistry': 'Ditt gåvoregister',
    'create.noGiftsAdded': 'Inga gåvor tillagda än. Lägg till din första gåva ovan.',
    'create.nextWeddingSettings': 'Nästa: Bröllopsinställningar',
    'create.giftPreview': 'Gåvförhandsvisning',
    'create.coverPreview': 'Omslagsförhandsvisning',
    'create.cover': 'Omslag',
    'create.previewHeader': 'Förhandsvisningshuvud',
    'create.previewContent': 'Förhandsvisningsinnehåll',
    
    // Gift Registry Overview
    'gifts.overview': 'Gåvoregister översikt',
    'gifts.giftName': 'Gåvnamn',
    'gifts.targetAmount': 'Målbelopp',
    'gifts.contributed': 'Bidragit',
    'gifts.contributors': 'Bidragsgivare',
    'gifts.noContributions': 'Inga bidrag än',
    'gifts.moreContributions': 'fler bidrag',
    'gifts.moreContributionsPlural': 'fler bidrag',
    'gifts.percentFunded': 'finansierad',
    'gifts.saveRegistry': 'Spara register',
    'gifts.registrySaved': 'Gåvoregister sparades framgångsrikt!',
    'gifts.deleting': 'Tar bort...',
    'gifts.readOnlyInfo': 'Hantera gåvor på Skapa bröllopssida',
    'gifts.deleteItem': 'Ta bort gåva',
    'gifts.saveChanges': 'Spara ändringar',
    'gifts.noGifts': 'Inga gåvor tillagda än',
    'gifts.addFirstGift': 'Lägg till din första gåva för att komma igång',
    
    // Contribute Page
    'contribute.title': 'Bidra till gåva',
    'contribute.description': 'Hjälp oss att förverkliga våra bröllopsdrömmar genom att bidra till denna gåva.',
    'contribute.alreadyContributed': 'Redan bidragit',
    'contribute.contributionAmount': 'Bidragsbelopp (SEK)',
    'contribute.yourName': 'Ditt namn (valfritt)',
    'contribute.message': 'Meddelande (valfritt)',
    'contribute.enterYourName': 'Ange ditt namn',
    'contribute.addPersonalMessage': 'Lägg till ett personligt meddelande',
    'contribute.payNow': 'Betala nu',
    'contribute.showSwishQR': 'Visa Swish QR-kod',
    'contribute.generatingQR': 'Genererar QR-kod...',
    'contribute.processing': 'Bearbetar...',
    'contribute.completedSwishPayment': 'Jag har slutfört min Swish-betalning',
    'contribute.scanQRCode': 'Skanna QR-koden med din Swish-app för att slutföra ditt bidrag.',
    'contribute.scanQRCodeWithSwish': 'Skanna denna QR-kod med din Swish-app för att slutföra din donation.',
    'contribute.phone': 'Telefon',
    'contribute.amount': 'Belopp',
    'contribute.securePaymentSwish': 'Säker betalning via Swish',
    'contribute.securePaymentStripe': 'Säker betalning via Stripe',
    'contribute.paymentEncrypted': 'Din betalning är krypterad och säkert bearbetad. Vi lagrar aldrig dina kortuppgifter.',
    'contribute.couldNotSaveDonation': 'Kunde inte spara din donation. Försök igen.',
    'contribute.backToWeddingPage': 'Tillbaka till bröllopssidan',
    'contribute.giftNotConfigured': 'Denna gåva är inte korrekt konfigurerad. Kontakta bröllopsarrangörerna.',
    'contribute.failedToCreateCheckout': 'Misslyckades att skapa kassasession',
    'contribute.giftNotFound': 'Gåva hittades inte',
    
    // Thank You Page
    'thankYou.title': 'Tack så mycket!',
    'thankYou.description': 'Tack för ditt generösa bidrag till vårt bröllop. Ditt stöd betyder allt för oss!',
    'thankYou.contributionProgress': 'Insamlat belopp',
    'thankYou.gift': 'Gåva',
    'thankYou.progress': 'Insamlat',
    'thankYou.sekContributed': 'sek bidragit',
    'thankYou.sekGoal': 'sek mål',
    'thankYou.fullyFunded': 'Helt finansierad!',
    'thankYou.returnToWeddingPage': 'Återgå till bröllopssidan',
    'thankYou.backToHome': 'Tillbaka till hem',
    
    // Wedding Page
    'weddingPage.title': 'Bröllopssida',
    'weddingPage.date': 'Datum',
    'weddingPage.location': 'Plats',
    'weddingPage.story': 'Vår berättelse',
    'weddingPage.giftRegistry': 'Önskelista',
    'weddingPage.contribute': 'Bidra',
    'weddingPage.photoGallery': 'Fotogalleri',
    'weddingPage.giftRegistryDescription': 'Er närvaro på vårt bröllop är den största gåvan av alla. Men om ni vill hedra oss med en gåva, har vi skapat denna önskelista.',
    'weddingPage.sekOf': 'sek av',
    'weddingPage.sek': 'sek',
    'weddingPage.contributed': 'bidragit',
    'weddingPage.goal': 'mål',
    'weddingPage.fullyFunded': 'Helt finansierad!',
    'weddingPage.backToHome': 'Tillbaka till hem',
    'weddingPage.weddingNotFound': 'Bröllop hittades inte',
    'weddingPage.error': 'Fel',
    'weddingPage.ourSpecialDay': 'Vår speciella dag',
    'weddingPage.joinUsDescription': 'Följ med oss när vi firar vår kärlekshistoria och börjar denna vackra resa tillsammans',
    'weddingPage.when': 'När',
    'weddingPage.ceremony': 'Ceremoni',
    'weddingPage.where': 'Var',
    'weddingPage.viewOnMaps': 'Visa på Google Maps',
    'weddingPage.ourStory': 'Vår berättelse',
    'weddingPage.loveStory': 'Kärlekshistoria',
    'weddingPage.celebrateWithUs': 'Fira med oss',
    'weddingPage.ourJourney': 'Vår resa',
    'weddingPage.journeyDescription': 'En glimt av vår kärlekshistoria genom ögonblicken som förde oss hit',
    'weddingPage.thankYou': 'Tack för att ni är en del av vår kärlekshistoria',
    'weddingPage.joinUs': 'Följ med oss på vår firande',
    
    'thankYou': 'Tack',
    
    // Errors and Loading
    'error.somethingWentWrong': 'Något gick fel',
    'error.unexpectedError': 'Ett oväntat fel uppstod',
    'error.failedToLoad': 'Misslyckades att ladda',
    'error.failedToSave': 'Misslyckades att spara',
    'error.failedToCreate': 'Misslyckades att skapa',
    'error.failedToUpdate': 'Misslyckades att uppdatera',
    'error.failedToDelete': 'Misslyckades att ta bort',
    'error.networkError': 'Nätverksfel. Kontrollera din anslutning.',
    'error.unauthorized': 'Obehörig. Logga in igen.',
    'error.notFound': 'Hittades inte',
    'loading.loading': 'Laddar...',
    'loading.saving': 'Sparar...',
    'loading.creating': 'Skapar...',
    'loading.updating': 'Uppdaterar...',
    'loading.deleting': 'Tar bort...',
    'loading.uploading': 'Laddar upp...',
    'loading.weddingDetails': 'Laddar bröllopsdetaljer...',
    'loading.giftRegistry': 'Laddar gåvoregister...',
    'loading.giftDetails': 'Laddar gåvadetaljer...',
    'loading.settings': 'Laddar inställningar...',
    'loading.settingUp': 'Konfigurerar...',
  }
};

// Context type
interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

// Create context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Function to detect if user is likely from Sweden
function detectSwedishUser(): boolean {
  try {
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    const browserLangs = navigator.languages?.map(lang => lang.toLowerCase()) || [];
    
    // Check if any browser language is Swedish
    const hasSwedishLang = browserLangs.some(lang => 
      lang.startsWith('sv') || 
      lang.includes('sv-se') || 
      lang.includes('sv-fi') ||
      lang === 'sv'
    );
    
    // Check timezone (Sweden is UTC+1/+2)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const swedishTimezones = [
      'Europe/Stockholm',
      'Europe/Gothenburg',
      'Europe/Malmö'
    ];
    const hasSwedishTimezone = swedishTimezones.includes(timezone);
    
    // Check if browser language suggests Swedish region
    const hasSwedishRegion = browserLangs.some(lang => 
      lang.includes('se') || // Sweden
      lang.includes('fi')    // Finland (Swedish speakers)
    );
    
    // Check number formatting locale (Swedish uses comma as decimal separator)
    const numberFormatter = new Intl.NumberFormat();
    const sampleNumber = numberFormatter.format(1.5);
    const usesSwedishNumberFormat = sampleNumber.includes(',');
    
    // Check date formatting locale
    const dateFormatter = new Intl.DateTimeFormat();
    const sampleDate = dateFormatter.format(new Date(2024, 0, 15)); // January 15, 2024
    const usesSwedishDateFormat = sampleDate.includes('15') && sampleDate.includes('jan'); // Swedish uses "jan" for January
    
    // Combine all detection methods
    const detectionScore = [
      hasSwedishLang ? 3 : 0,      // Strong indicator
      hasSwedishTimezone ? 2 : 0,  // Good indicator
      hasSwedishRegion ? 1 : 0,    // Weak indicator
      usesSwedishNumberFormat ? 1 : 0, // Weak indicator
      usesSwedishDateFormat ? 1 : 0    // Weak indicator
    ].reduce((sum, score) => sum + score, 0);
    
    // Consider user Swedish if score is 2 or higher
    return detectionScore >= 2;
  } catch (error) {
    // Fallback to simple browser language check if advanced detection fails
    console.warn('Language detection failed, using fallback:', error);
    return navigator.language.toLowerCase().startsWith('sv');
  }
}

// Provider component
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const auth = useAuth();

  // Load saved language preference or detect Swedish users
  useEffect(() => {
    const loadLanguagePreference = async () => {
      // Check if we're on a public wedding page (guest pages should not use localStorage)
      const isPublicWeddingPage = window.location.pathname.includes('/wedding/') || 
                                 window.location.pathname.match(/^\/[^\/]+\/contribute/) ||
                                 window.location.pathname.match(/^\/[^\/]+\/thank-you/);
      
      if (isPublicWeddingPage) {
        // For public wedding pages, don't initialize from localStorage
        // The language will be set by the wedding data when it loads
        console.log('Public wedding page detected, skipping localStorage language initialization');
        return;
      }

      // First check localStorage for immediate loading
      const savedLanguage = localStorage.getItem('wedding-wish-language') as Language;
      
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sv')) {
        // User has explicitly set a language preference in localStorage
        setLanguage(savedLanguage);
        
        // If user is authenticated, also save to database
        if (auth.user) {
          await saveLanguageToDatabase(savedLanguage);
        }
      } else if (auth.user) {
        // User is authenticated, try to load from database
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}api/settings`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await auth.getToken()}`,
            },
          });
          
          if (response.ok) {
            const settings = await response.json();
            if (settings.languageSettings?.language) {
              setLanguage(settings.languageSettings.language);
              localStorage.setItem('wedding-wish-language', settings.languageSettings.language);
              return;
            }
          }
        } catch (error) {
          console.error('Error loading language from database:', error);
        }
      }
      
      // No saved preference, detect if user is Swedish
      const isSwedishUser = detectSwedishUser();
      const defaultLanguage = isSwedishUser ? 'sv' : 'en';
      
      // Debug logging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Language detection:', {
          browserLang: navigator.language,
          browserLangs: navigator.languages,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          isSwedishUser,
          defaultLanguage
        });
      }
      
      setLanguage(defaultLanguage);
      
      // Save the detected language preference
      localStorage.setItem('wedding-wish-language', defaultLanguage);
      
      // If user is authenticated, also save to database
      if (auth.user) {
        await saveLanguageToDatabase(defaultLanguage);
      }
    };

    loadLanguagePreference();
  }, [auth.user]);

  // Save language preference to database
  const saveLanguageToDatabase = async (lang: Language) => {
    if (!auth.user) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({
          userId: auth.user.email,
          email: auth.user.email,
          languageSettings: {
            language: lang
          }
        }),
      });
    } catch (error) {
      console.error('Error saving language to database:', error);
    }
  };

  // Save language preference
  useEffect(() => {
    localStorage.setItem('wedding-wish-language', language);
    
    // Also save to database if user is authenticated
    if (auth.user) {
      saveLanguageToDatabase(language);
    }
  }, [language, auth.user]);

  // Translation function
  const t = (key: TranslationKey): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Language selector component
export function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-sm rounded ${
          language === 'en' 
            ? 'bg-pink-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('sv')}
        className={`px-2 py-1 text-sm rounded ${
          language === 'sv' 
            ? 'bg-pink-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        SV
      </button>
    </div>
  );
}
