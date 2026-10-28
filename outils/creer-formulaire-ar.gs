/**
 * Crée le formulaire client « Pulse Digital » en arabe (mêmes offres que le formulaire français).
 * Les réponses arrivent dans la même Google Sheet de réponses, dans un nouvel onglet.
 * script.google.com/u/1/create → coller → Ctrl+S → Exécuter → autoriser (compte astralzayte).
 * Le lien à envoyer s'affiche dans le Journal d'exécution.
 */
function creerFormulaireArabe() {
  var form = FormApp.create('Pulse Digital — Formulaire arabe');
  form.setTitle('Pulse Digital : عرضكم');
  form.setDescription(
    'زبونات أكثر لصالونكم، دون أي مجهود من جانبكم.\n\n' +
    'بدون التزام، الدفع كل أسبوع، التركيب مجاني، وفاتورة مع كل دفعة.\n' +
    'عرض الإطلاق: أسعار ثابتة مدى الحياة لأول 10 صالونات.\n\n' +
    'دقيقتان: اختاروا ما يهمّكم، وسيرد عليكم جوليان في واتساب.');
  form.setProgressBar(true);

  // Page 1 : contact + offres
  form.addTextItem().setTitle('اسم الصالون').setRequired(true);
  form.addTextItem().setTitle('رقم واتساب الخاص بكم').setRequired(true)
    .setHelpText('سيرد عليكم جوليان على هذا الرقم.')
    .setValidation(FormApp.createTextValidation()
      .setHelpText('أدخلوا رقم واتساب الخاص بكم (مثال: 06 12 34 56 78).')
      .requireTextMatchesPattern('^ *(\\+212|\\+33|00212|0033|0) *[67]([ .-]?[0-9]){8} *$').build());

  form.addMultipleChoiceItem().setTitle('عرضكم الأسبوعي').setRequired(true)
    .setHelpText('بدون التزام: يمكنكم التوقف متى شئتم.')
    .setChoiceValues([
      'البداية: 100 درهم في الأسبوع. واتساب صالونكم يرد على زبوناتكم 24/24 خلال 5 ثوانٍ (الأسعار، المواعيد، الحجز). بثمن تسريحة شعر واحدة.',
      'الأساسي (ننصح به): 450 درهم في الأسبوع بدل 500. واتساب آلي + 7 فيديوهات و7 ستوريات تُنشر لكم كل أسبوع.',
      'ألترا: 900 درهم في الأسبوع بدل 1000. واتساب وإنستغرام آليان + 15 فيديو و21 ستوري كل أسبوع.',
      'لا أعرف بعد: انصحوني في واتساب',
      'بدون عرض أسبوعي'
    ]);

  form.addMultipleChoiceItem().setTitle('لانطلاقة قوية (دفعة واحدة)')
    .setChoiceValues([
      'الانطلاقة: 1800 درهم بدل 2100. دراسة السوق + إنشاء حساباتكم على مواقع التواصل مع شعار + موقع إلكتروني مع حجز المواعيد.',
      'الانطلاقة برو: 2600 درهم بدل 3100. كل ما في الانطلاقة + شهر من الإعلانات نديرها لكم (ميزانية الإعلانات على حسابكم).',
      'لا، شكراً'
    ]);

  form.addCheckboxItem().setTitle('إضافات (اختياري)')
    .setChoiceValues([
      'إنستغرام آلي (الرد على الرسائل الخاصة 24/24): 100 درهم في الأسبوع',
      'إدارة إعلاناتكم على فيسبوك وإنستغرام وتيك توك: 250 درهم في الأسبوع (ميزانية الإعلانات على حسابكم)',
      'موقع إلكتروني وحده + اسم النطاق: 1500 درهم',
      'دراسة السوق وحدها: 300 درهم',
      'إنشاء حساباتكم على مواقع التواصل مع شعار: 300 درهم',
      'فيديوهات أو ستوريات إضافية: الفيديوهات ابتداءً من 150 درهم في الأسبوع، والستوريات من 50 درهم في الأسبوع'
    ]);

  // Page 2 : infos pour préparer l'offre (tout est facultatif)
  form.addPageBreakItem().setTitle('لتحضير عرضكم (اختياري)')
    .setHelpText('يمكنكم أيضاً إرسال هذه المعلومات في واتساب. اضغطوا على «إرسال» إذا أردتم الإنهاء الآن.');
  form.addTextItem().setTitle('عنوان الصالون');
  form.addTextItem().setTitle('أوقات العمل');
  form.addParagraphTextItem().setTitle('خدماتكم وأسعارها')
    .setHelpText('أو اكتبوا «سأرسل صورة قائمة الأسعار في واتساب».');
  form.addParagraphTextItem().setTitle('الأسئلة الخمسة التي تطرحها زبوناتكم أكثر، مع أجوبتكم');
  form.addParagraphTextItem().setTitle('حسابكم على إنستغرام أو تيك توك (الروابط)');
  form.addCheckboxItem().setTitle('الأسلوب المطلوب').setChoiceValues(['أنيق', 'دافئ', 'مرح', 'عصري', 'تقليدي']);
  form.addParagraphTextItem().setTitle('أهم 3 منافسين لكم');
  form.addTextItem().setTitle('اسم الموقع المرغوب (مثال: salonlina.com)');

  form.setConfirmationMessage(
    'شكراً! وصلنا طلبكم وتم حجز سعر الإطلاق لكم. سيتواصل معكم جوليان قريباً في واتساب لتجهيز كل شيء. Pulse Digital');

  // Même Google Sheet de réponses que le formulaire français (nouvel onglet)
  form.setDestination(FormApp.DestinationType.SPREADSHEET, '1bL_39qJ3cPVC8J0j0wiW8Wm4OXotvLpkU6s91tEtioE');
  try { form.setPublished(true); } catch (e) {}
  form.setAcceptingResponses(true);

  Logger.log('LIEN ARABE A ENVOYER : ' + form.getPublishedUrl());
  Logger.log('Modifier : ' + form.getEditUrl());
}
