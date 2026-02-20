import { v4 as uuidv4 } from 'uuid';
import type { Newsletter } from '../types';
import { THEMES } from './themes';

export function createDefaultNewsletter(): Newsletter {
  const headerId   = uuidv4();
  const tickerId   = uuidv4();
  const div1Id     = uuidv4();
  const articleId  = uuidv4();
  const spotId     = uuidv4();
  const div2Id     = uuidv4();
  const ethicsId   = uuidv4();
  const sbarId     = uuidv4();
  const termId     = uuidv4();
  const historyId  = uuidv4();
  const humorId    = uuidv4();
  const spacerId   = uuidv4();
  const footerId   = uuidv4();

  return {
    meta: {
      id: uuidv4(),
      title: 'The Neurology AI Pulse',
      issueNumber: '001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    theme: THEMES.northwell,
    rows: [
      { id: uuidv4(), layout: '1col', blockIds: [headerId] },
      { id: uuidv4(), layout: '1col', blockIds: [tickerId] },
      { id: uuidv4(), layout: '1col', blockIds: [div1Id] },
      { id: uuidv4(), layout: '1col', blockIds: [articleId] },
      { id: uuidv4(), layout: '1col', blockIds: [spotId] },
      { id: uuidv4(), layout: '1col', blockIds: [div2Id] },
      { id: uuidv4(), layout: '2col', blockIds: [ethicsId, sbarId] },
      { id: uuidv4(), layout: '2col', blockIds: [termId, historyId] },
      { id: uuidv4(), layout: '1col', blockIds: [humorId] },
      { id: uuidv4(), layout: '1col', blockIds: [spacerId] },
      { id: uuidv4(), layout: '1col', blockIds: [footerId] },
    ],
    blocks: {

      // ── HEADER ─────────────────────────────────────────────────
      [headerId]: {
        id: headerId,
        type: 'header',
        title: 'The Neurology AI Pulse',
        subtitle: 'Artificial Intelligence in Clinical Neuroscience',
        issueNumber: 'Issue 001',
        issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        tagline: 'Edited by Yasir El-Sherif MD, PhD & Jai Shahani MD · Staten Island University Hospital · Northwell Health',
      },

      // ── TICKER ─────────────────────────────────────────────────
      [tickerId]: {
        id: tickerId,
        type: 'ticker',
        items: [
          'Nature Medicine: AI CT screening reaches 94.3% sensitivity across 47 RCTs',
          'AHA Class IIa — AI ECG now recommended for AF screening in adults 65+',
          'JAMA RCT: Ambient AI scribes reduce physician burnout 34% at 6 months',
          'FDA authorizes record 692 AI medical devices in 2024 — 38% YoY increase',
          'Cochrane: AI decision support cuts prescribing errors 37%',
          'Northwell Neurology AI Symposium — Register Now',
        ],
        speed: 'medium',
      },

      // ── DIVIDER 1 ──────────────────────────────────────────────
      [div1Id]: {
        id: div1Id,
        type: 'section-divider',
        label: 'TOP NEUROLOGY AI NEWS',
        style: 'gradient',
      },

      // ── ARTICLE GRID ───────────────────────────────────────────
      [articleId]: {
        id: articleId,
        type: 'article-grid',
        sectionTitle: 'This Week in Neurology AI',
        columns: 2,
        articles: [
          {
            id: uuidv4(),
            title: 'Retraining Machine Learning Models for Seizure Classification from EEG Data',
            source: 'Nature',
            url: 'https://www.nature.com',
            imageUrl: '',
            summary: 'This research evaluates the efficacy of retraining CNNs and LSTMs using the Temple University Hospital Seizure Detection Corpus. Analyzing data from over 1,500 patients, optimized deep learning architectures achieve seizure classification accuracy exceeding 90%, addressing the critical clinical need for faster EEG interpretation in busy EMU and ICU settings.',
            clinicalReview: 'While institutional retraining remains vital for precision, the ability to achieve >90% accuracy in busy EMU or ICU settings is a game-changer for reducing cognitive load on neurologists and enabling faster treatment decisions.',
            myView: 'This is the kind of AI that meaningfully changes practice — not replacing neurophysiologist judgment, but dramatically improving the throughput and reliability of EEG screening at scale across high-volume centers.',
            evidenceLevel: 'Moderate',
            comments: [
              { id: uuidv4(), author: 'Dr. Jai Shahani', role: 'Attending Neurologist', text: 'We should explore piloting this in our EMU. The false positive rate on artifacts needs clarification before rollout — want to avoid alarm fatigue.', timestamp: new Date().toISOString() },
            ],
          },
          {
            id: uuidv4(),
            title: 'AI Reads Brain MRIs in Seconds and Flags Emergencies with 94.6% Accuracy',
            source: 'ScienceDaily',
            url: 'https://www.sciencedaily.com',
            imageUrl: '',
            summary: 'Researchers developed a deep-learning AI tool that analyzes brain MRIs in seconds to flag life-threatening conditions including hemorrhages and strokes. Using a dataset of 14,000 scans, the algorithm achieved 94.6% accuracy in identifying emergency cases, prioritizing critical findings for radiologists and reducing time-to-treatment.',
            clinicalReview: 'In high-volume stroke centers, these AI first-responders are invaluable for triage. By automating the prioritization of acute injuries, we can significantly reduce door-to-needle times and directly improve long-term functional outcomes.',
            myView: 'The accuracy figures are impressive, but the real-world implementation challenge is integration with existing PACS and radiologist workflows. This requires careful deployment planning and clear human-in-the-loop protocols.',
            evidenceLevel: 'High',
            comments: [],
          },
          {
            id: uuidv4(),
            title: 'RimeSleepNet: Hybrid Deep Learning for s-EEG Sleep Stage Classification',
            source: 'ScienceDirect',
            url: 'https://www.sciencedirect.com',
            imageUrl: '',
            summary: 'RimeSleepNet, a hybrid deep learning model combining CNNs and Bi-LSTMs, automates sleep stage classification using stereoelectroencephalography data. Tested on 16 epilepsy patients, the framework achieved 86.4% overall accuracy by optimizing spatial and temporal feature extraction through the Rime algorithm.',
            clinicalReview: 'Automating s-EEG staging offers a powerful opportunity to streamline complex epilepsy presurgical workflows. Granular deep-brain data will refine our understanding of sleep\'s role in seizure localization.',
            myView: 'I am particularly optimistic about how this will improve surgical counseling for patients with refractory epilepsy. The sample size is small — multicenter validation is the essential next step.',
            evidenceLevel: 'Low',
            comments: [],
          },
          {
            id: uuidv4(),
            title: 'EEG Foundation Models Generalize Across Clinical Sites Without Site-Specific Fine-Tuning',
            source: 'Nature Medicine',
            url: 'https://www.nature.com/nm/',
            imageUrl: '',
            summary: 'A transformer-based EEG model pre-trained on 100,000 recordings showed strong cross-site generalization for seizure detection without site-specific fine-tuning — addressing one of the most persistent barriers to real-world clinical deployment of EEG AI.',
            clinicalReview: 'Cross-site generalizability is the holy grail for EEG AI. This is a meaningful step toward clinical deployment in ICU monitoring. The shortage of clinical neurophysiologists makes scalable solutions urgent.',
            myView: 'EEG is one of the best domains for AI given its data volume. This work is foundational — if it holds up in prospective multicenter validation, it changes the calculus for AI-assisted neurophysiology significantly.',
            evidenceLevel: 'High',
            comments: [],
          },
        ],
      },

      // ── SPOTLIGHT ──────────────────────────────────────────────
      [spotId]: {
        id: spotId,
        type: 'spotlight',
        title: 'A Simple Twist Fooled AI — And Revealed a Dangerous Flaw in Medical Ethics Guardrails',
        source: 'ScienceDaily',
        url: 'https://www.sciencedaily.com',
        summary: 'This study reveals that medical AI models can be manipulated through simple linguistic techniques to bypass ethical guardrails and provide harmful advice. This exposes significant vulnerabilities in current AI governance — showing how jailbreaking techniques can compromise patient safety and data integrity in clinical settings.',
        clinicalReview: 'This vulnerability is deeply concerning because it threatens the foundational principle of non-maleficence in neurology. The implications extend beyond individual patient harm to systemic trust in AI-augmented clinical decision-making at the institutional level.',
        myView: 'We must ensure AI tools are resilient against manipulation before integration into sensitive clinical environments. Regulatory bodies need to require adversarial robustness testing as a precondition for FDA clearance. This cannot be optional.',
        evidenceLevel: 'Expert Opinion',
      },

      // ── DIVIDER 2 ──────────────────────────────────────────────
      [div2Id]: {
        id: div2Id,
        type: 'section-divider',
        label: 'PERSPECTIVES & SKILLS',
        style: 'gradient',
      },

      // ── ETHICS ─────────────────────────────────────────────────
      [ethicsId]: {
        id: ethicsId,
        type: 'ethics-split',
        topic: 'Algorithmic Bias in Neurology AI: Who Gets Left Behind?',
        issue: 'Most published neurology AI models are trained predominantly on data from academic medical centers in North America and Europe, with known underrepresentation of Black, Hispanic, and rural populations. Stroke risk prediction models may systematically underperform in these populations — with direct harm potential in triage, treatment allocation, and prognosis.',
        myView: 'This is not an abstract equity concern. I have seen AI triage tools produce divergent outputs for identical presentations across demographic groups. Regulatory bodies must require prospective demographic stratification of performance data before any neurology AI tool receives FDA clearance. This is a patient safety imperative, not a political one.',
      },

      // ── SBAR-P FRAMEWORK ───────────────────────────────────────
      [sbarId]: {
        id: sbarId,
        type: 'sbar-prompt',
        title: 'Prompt Like a Rockstar: The SBAR-P Framework',
        intro: 'High-yield prompting begins with the SBAR-P framework — adapted from clinical handover protocols. Well-crafted prompts save time and improve clinical decision support. Bad prompts produce misleading information. Master prompting, master AI.',
        steps: [
          { letter: 'S', name: 'Situation', description: 'Define your persona and state the clinical context clearly — patient age, sex, setting, presenting problem.', example: '"Act as a Senior Neurologist. My patient is a 67F presenting with subacute onset expressive aphasia over 3 days..."' },
          { letter: 'B', name: 'Background', description: 'Provide relevant history, comorbidities, medications, and recent investigations that shape your clinical question.', example: '"PMH: hypertension, AF on apixaban. MRI brain: FLAIR hyperintensity left MCA territory. No gadolinium enhancement."' },
          { letter: 'A', name: 'Ask', description: 'Be explicit. Verb-driven. Request specific format (differential, table, summary). Avoid vague questions.', example: '"Generate a prioritised differential of the top 5 causes. For each: likelihood, supporting features, and one targeted investigation."' },
          { letter: 'R', name: 'Role', description: 'Assign a clinical persona. The AI performs better when given a specialist frame of reference aligned with your question.', example: '"Respond as a vascular neurologist preparing for a stroke multidisciplinary team meeting."' },
          { letter: 'P', name: 'Parameters', description: 'Set safety guardrails. Specify evidence base, uncertainty disclosure, and constraints. Use Chain-of-Thought by adding "Think step-by-step."', example: '"Use current AHA/ASA stroke guidelines. Flag areas of uncertainty. Do not hallucinate imaging findings. Think step-by-step."' },
        ],
        promptTemplate: `Act as a [SPECIALTY] specialist.

Patient: [AGE] [SEX], [SETTING — inpatient/ED/outpatient]
Presentation: [CHIEF COMPLAINT] for [DURATION]
Key findings: [VITALS, EXAM FINDINGS, KEY LABS/IMAGING]
PMH: [COMORBIDITIES]
Medications: [MED LIST]

Task: [SPECIFIC QUESTION — e.g. "Generate a prioritised differential of the top 5 conditions"]
Format: [LIST / TABLE / SOAP NOTE / SUMMARY]
Evidence: [GUIDELINE — e.g. "Current AHA/ASA guidelines"]

Think step-by-step. Flag any recommendation where evidence is limited or where you are uncertain. Do not fabricate lab values, imaging findings, or drug doses. State your confidence level for each recommendation.`,
        safetyNotes: [
          'Verify all outputs. AI can hallucinate drug doses, lab values, and guideline details. Always cross-reference with UpToDate or the primary source before acting.',
          'Never enter identifiable patient data into consumer AI tools. Use only HIPAA-compliant, enterprise-approved platforms within your institution.',
          'Clinical judgement remains paramount. AI is a decision support tool. You are responsible for all clinical decisions and documentation.',
          'Knowledge cutoffs matter. For rapidly evolving guidance (antimicrobials, oncology), always verify against the current version of the relevant guideline.',
        ],
      },

      // ── TERM OF MONTH ──────────────────────────────────────────
      [termId]: {
        id: termId,
        type: 'term-of-month',
        term: 'Foundation Model',
        definition: 'A large-scale AI system trained on a vast and diverse dataset — such as millions of medical images or text records — that serves as a versatile base for many different tasks. Unlike traditional narrow AI designed for a single purpose, foundation models learn broad generalized patterns that can be adapted to multiple clinical functions.',
        clinicalContext: 'Foundation models represent a shift from building separate tools for every disease to using a single robust system that understands the language of medical data. A vision foundation model trained on massive libraries of brain MRIs can recognize general neuroanatomy and flag multiple emergency conditions — strokes, mass effects, hemorrhages — rather than requiring a separate algorithm for each.',
      },

      // ── HISTORY ────────────────────────────────────────────────
      [historyId]: {
        id: historyId,
        type: 'history',
        year: '1950',
        title: 'The Dawn of AI: The Turing Test',
        content: 'In 1950, mathematician Alan Turing published Computing Machinery and Intelligence, posing the provocative question: "Can machines think?" Rather than debating definitions of thinking, he proposed the Imitation Game — now the Turing Test — to measure a machine\'s ability to exhibit behavior indistinguishable from a human. This shift from theoretical philosophy to practical experimentation provided the logical foundation for all of modern AI, sparking a decades-long quest to build machines that not only calculate, but reason.',
      },

      // ── HUMOR ──────────────────────────────────────────────────
      [humorId]: {
        id: humorId,
        type: 'humor',
        heading: '🧠 Neural Network Humor',
        content: 'My AI dictation system transcribed "patient denies diplopia" as "patient denies diplopia, but suspects the government." To be fair, given the context of the visit, I cannot entirely rule this out.',
        attribution: '— Submitted anonymously by a Northwell attending',
      },

      // ── SPACER ─────────────────────────────────────────────────
      [spacerId]: { id: spacerId, type: 'spacer', height: 24 },

      // ── FOOTER ─────────────────────────────────────────────────
      [footerId]: {
        id: footerId,
        type: 'footer',
        institution: 'Northwell Health',
        department: 'Department of Neurology · Staten Island University Hospital',
        contactEmail: 'yelsheri@northwell.edu',
        unsubscribeUrl: '#',
        websiteUrl: 'https://www.northwell.edu/neurology',
        copyrightYear: new Date().getFullYear().toString(),
        disclaimer: 'This newsletter is for educational purposes only and does not constitute medical advice. Content represents the views of the authors and not Northwell Health as an institution. All AI-generated content should be verified with primary sources before clinical application.',
        socials: [],
        contributors: [
          { id: uuidv4(), name: 'Yasir El-Sherif, MD PhD', role: 'Editor-in-Chief', url: '' },
          { id: uuidv4(), name: 'Jai Shahani, MD', role: 'Associate Editor', url: '' },
        ],
      },
    },
  };
}

export const BLOCK_LABELS: Record<string, string> = {
  'header': '🏷️ Header',
  'ticker': '📡 Scrolling Ticker',
  'section-divider': '➖ Section Divider',
  'article-grid': '📰 Article Grid',
  'spotlight': '🔦 Spotlight Article',
  'ethics-split': '⚖️ Ethics Split',
  'image': '🖼️ Image',
  'text': '📝 Text Block',
  'prompt-masterclass': '🤖 Prompt Masterclass',
  'sbar-prompt': '🧭 SBAR-P Framework',
  'term-of-month': '📖 Term of the Month',
  'history': '🕰️ History Block',
  'humor': '😄 Humor Block',
  'spacer': '↕️ Spacer',
  'footer': '🔻 Footer',
};
