import React, { createContext, useContext, useState, useEffect } from 'react';

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
    
    // Home Page
    'home.title': 'WeddingWish',
    'home.subtitle': 'Create beautiful wedding pages and gift registries',
    'home.getStarted': 'Get Started',
    'home.login': 'Login',
    'home.register': 'Register',
    'home.features': 'Features',
    'home.createPage': 'Create Wedding Page',
    'home.giftRegistry': 'Gift Registry',
    'home.contribute': 'Easy Contributions',
    'home.secure': 'Secure Payments',
    
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
    'create.updateWeddingPage': 'Update Wedding Page',
    'create.nextPhotos': 'Next: Photos',
    'create.nextGifts': 'Next: Gifts',
    'create.nextPreview': 'Next: Preview',
    'create.back': 'Back',
    
    // Wedding Details Tab
    'create.weddingTitle': 'Wedding Title',
    'create.weddingTitlePlaceholder': 'John & Jane\'s Wedding',
    'create.weddingDate': 'Wedding Date',
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
    'create.modern': 'Modern',
    'create.rustic': 'Rustic',
    'create.elegant': 'Elegant',
    'create.minimalist': 'Minimalist',
    'create.primaryColor': 'Primary Color',
    'create.selectColor': 'Select color',
    'create.pink': 'Pink',
    'create.blue': 'Blue',
    'create.green': 'Green',
    'create.purple': 'Purple',
    'create.gold': 'Gold',
    
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
    'settings.failedToStartStripe': 'Failed to start Stripe Connect onboarding',
    'settings.failedToStartStripeError': 'Failed to start Stripe Connect onboarding. Please try again.',
    'settings.displayContributorNames': 'Display the names of people who contribute to your registry',
    'settings.displayContributionAmounts': 'Display how much each person contributed',
    'settings.letGuestsLeaveComments': 'Let guests leave comments on your wedding page',
    'settings.makeRegistryVisible': 'Make your gift registry visible to guests',
    'settings.receiveEmailNotifications': 'Receive notifications via email',
    'settings.getNotifiedOnContribution': 'Get notified when someone contributes to your registry',
    'settings.receiveWeeklySummary': 'Receive a weekly summary of activity',
    'settings.receiveMarketingUpdates': 'Receive updates and offers from WeddingWish',
    'settings.enterPrivateSwishNumber': 'Enter your private Swish phone number (not a business number).',
    'settings.emailAssociatedWithPayment': 'Email associated with your payment account',
    'settings.receiveEmailOnContribution': 'Receive an email when someone contributes',
    'settings.automaticThankYouEmails': 'Automatic thank you emails',
    'settings.sendAutomaticThankYou': 'Send automatic thank you emails to contributors',
    'settings.contributionSettings': 'Contribution Settings',
    
    // Create Wedding Page Additional Keys
    'create.coverPhotoDescription': 'This will be the main image at the top of your wedding page.',
    'create.additionalPhotosDescription': 'Add more photos to your wedding gallery (optional).',
    'create.remove': 'Remove',
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
    'contribute.title': 'Contribute to the Wedding Couple',
    'contribute.description': 'Your contribution will go directly to the couple and help make their day even more special.',
    'contribute.alreadyContributed': 'Already contributed',
    'contribute.amount': 'Contribution Amount (SEK)',
    'contribute.yourName': 'Your Name (optional)',
    'contribute.message': 'Message (optional)',
    'contribute.enterName': 'Enter your name',
    'contribute.addMessage': 'Add a personal message',
    'contribute.payNow': 'Pay Now',
    'contribute.showSwishQR': 'Show Swish QR Code',
    'contribute.showPaymentDetails': 'Show Payment Details',
    'contribute.processing': 'Processing...',
    'contribute.completedPayment': 'I\'ve completed my Swish payment',
    'contribute.scanQRCode': 'Scan this QR code with your Swish app to complete your donation.',
    'contribute.phone': 'Phone',
    'contribute.amountLabel': 'Amount',
    'contribute.messageLabel': 'Message',
    'contribute.securePayment': 'Secure payment via Swish',
    'contribute.securePaymentStripe': 'Secure payment by Stripe',
    'contribute.followInstructions': 'Follow the payment instructions to complete your contribution via Swish.',
    'contribute.encryptedPayment': 'Your payment is encrypted and securely processed. We never store your card details.',
    
    // Thank You Page
    'thankYou.title': 'Thank You for Your Contribution!',
    'thankYou.description': 'Your generosity means the world to us. Your contribution will help make our special day even more memorable. We can\'t wait to celebrate with you!',
    'thankYou.contributionProgress': 'Contribution Progress',
    'thankYou.gift': 'Gift',
    'thankYou.progress': 'Progress',
    'thankYou.contributed': 'contributed',
    'thankYou.goal': 'goal',
    'thankYou.fullyFunded': 'Fully Funded!',
    'thankYou.returnToWedding': 'Return to Wedding Page',
    'thankYou.backToHome': 'Back to Home',
    
    // Wedding Page
    'weddingPage.title': 'Wedding Page',
    'weddingPage.date': 'Date',
    'weddingPage.location': 'Location',
    'weddingPage.story': 'Our Story',
    'weddingPage.giftRegistry': 'Gift Registry',
    'weddingPage.contribute': 'Contribute',
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
    
    // Gifts
    'gifts.title': 'Gåvoregister',
    'gifts.add': 'Lägg till gåva',
    'gifts.edit': 'Redigera gåva',
    'gifts.price': 'Pris',
    'gifts.description': 'Beskrivning',
    'gifts.image': 'Bild',
    'gifts.totalContributed': 'Totalt bidragit',
    'gifts.progress': 'Framsteg',
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
    
    // Home Page
    'home.title': 'WeddingWish',
    'home.subtitle': 'Skapa vackra bröllopssidor och gåvoregister',
    'home.getStarted': 'Kom igång',
    'home.login': 'Logga in',
    'home.register': 'Registrera',
    'home.features': 'Funktioner',
    'home.createPage': 'Skapa bröllopssida',
    'home.giftRegistry': 'Gåvoregister',
    'home.contribute': 'Enkla bidrag',
    'home.secure': 'Säkra betalningar',
    
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
    'create.updateWeddingPage': 'Uppdatera bröllopssida',
    'create.nextPhotos': 'Nästa: Foton',
    'create.nextGifts': 'Nästa: Gåvor',
    'create.nextPreview': 'Nästa: Förhandsvisning',
    'create.back': 'Tillbaka',
    
    // Wedding Details Tab
    'create.weddingTitle': 'Bröllopstitel',
    'create.weddingTitlePlaceholder': 'John & Janes bröllop',
    'create.weddingDate': 'Bröllopsdag',
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
    'create.modern': 'Modern',
    'create.rustic': 'Rustik',
    'create.elegant': 'Elegant',
    'create.minimalist': 'Minimalistisk',
    'create.primaryColor': 'Primärfärg',
    'create.selectColor': 'Välj färg',
    'create.pink': 'Rosa',
    'create.blue': 'Blå',
    'create.green': 'Grön',
    'create.purple': 'Lila',
    'create.gold': 'Guld',
    
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
    'settings.failedToStartStripe': 'Misslyckades att starta Stripe Connect onboarding',
    'settings.failedToStartStripeError': 'Misslyckades att starta Stripe Connect onboarding. Försök igen.',
    'settings.displayContributorNames': 'Visa namnen på personer som bidrar till ditt register',
    'settings.displayContributionAmounts': 'Visa hur mycket varje person bidrog',
    'settings.letGuestsLeaveComments': 'Låt gäster lämna kommentarer på din bröllopssida',
    'settings.makeRegistryVisible': 'Gör ditt gåvoregister synligt för gäster',
    'settings.receiveEmailNotifications': 'Ta emot notifieringar via e-post',
    'settings.getNotifiedOnContribution': 'Få notifiering när någon bidrar till ditt register',
    'settings.receiveWeeklySummary': 'Ta emot en veckosammanfattning av aktivitet',
    'settings.receiveMarketingUpdates': 'Ta emot uppdateringar och erbjudanden från WeddingWish',
    'settings.enterPrivateSwishNumber': 'Ange ditt privata Swish-telefonnummer (inte ett företagsnummer).',
    'settings.emailAssociatedWithPayment': 'E-post associerad med ditt betalningskonto',
    'settings.receiveEmailOnContribution': 'Ta emot ett e-postmeddelande när någon bidrar',
    'settings.automaticThankYouEmails': 'Automatiska tack-e-postmeddelanden',
    'settings.sendAutomaticThankYou': 'Skicka automatiska tack-e-postmeddelanden till bidragsgivare',
    'settings.contributionSettings': 'Bidragsinställningar',
    
    // Create Wedding Page Additional Keys
    'create.coverPhotoDescription': 'Detta kommer att vara huvudbilden högst upp på din bröllopssida.',
    'create.additionalPhotosDescription': 'Lägg till fler foton i din bröllopsgalleri (valfritt).',
    'create.remove': 'Ta bort',
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
    'contribute.title': 'Bidra till bröllopsparet',
    'contribute.description': 'Ditt bidrag går direkt till paret och hjälper till att göra deras dag ännu mer speciell.',
    'contribute.alreadyContributed': 'Redan bidragit',
    'contribute.amount': 'Bidragsbelopp (SEK)',
    'contribute.yourName': 'Ditt namn (valfritt)',
    'contribute.message': 'Meddelande (valfritt)',
    'contribute.enterName': 'Ange ditt namn',
    'contribute.addMessage': 'Lägg till ett personligt meddelande',
    'contribute.payNow': 'Betala nu',
    'contribute.showSwishQR': 'Visa Swish QR-kod',
    'contribute.showPaymentDetails': 'Visa betalningsdetaljer',
    'contribute.processing': 'Bearbetar...',
    'contribute.completedPayment': 'Jag har slutfört min Swish-betalning',
    'contribute.scanQRCode': 'Skanna denna QR-kod med din Swish-app för att slutföra din donation.',
    'contribute.phone': 'Telefon',
    'contribute.amountLabel': 'Belopp',
    'contribute.messageLabel': 'Meddelande',
    'contribute.securePayment': 'Säker betalning via Swish',
    'contribute.securePaymentStripe': 'Säker betalning av Stripe',
    'contribute.followInstructions': 'Följ betalningsinstruktionerna för att slutföra ditt bidrag via Swish.',
    'contribute.encryptedPayment': 'Din betalning är krypterad och säkert bearbetad. Vi lagrar aldrig dina kortuppgifter.',
    
    // Thank You Page
    'thankYou.title': 'Tack för ditt bidrag!',
    'thankYou.description': 'Din generositet betyder allt för oss. Ditt bidrag kommer att hjälpa till att göra vår speciella dag ännu mer minnesvärd. Vi ser fram emot att fira med dig!',
    'thankYou.contributionProgress': 'Bidragsframsteg',
    'thankYou.gift': 'Gåva',
    'thankYou.progress': 'Framsteg',
    'thankYou.contributed': 'bidragit',
    'thankYou.goal': 'mål',
    'thankYou.fullyFunded': 'Helt finansierad!',
    'thankYou.returnToWedding': 'Återgå till bröllopssidan',
    'thankYou.backToHome': 'Tillbaka till hem',
    
    // Wedding Page
    'weddingPage.title': 'Bröllopssida',
    'weddingPage.date': 'Datum',
    'weddingPage.location': 'Plats',
    'weddingPage.story': 'Vår berättelse',
    'weddingPage.giftRegistry': 'Gåvoregister',
    'weddingPage.contribute': 'Bidra',
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

// Provider component
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('wedding-wish-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sv')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('wedding-wish-language', language);
  }, [language]);

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
