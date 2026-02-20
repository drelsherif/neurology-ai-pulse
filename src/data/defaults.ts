import { v4 as uuidv4 } from 'uuid';
import type { Newsletter } from '../types';
import { THEMES } from './themes';

export function createDefaultNewsletter(): Newsletter {
  const headerId = uuidv4();
  const tickerId = uuidv4();
  const divider1Id = uuidv4();
  const articleGridId = uuidv4();
  const spotlightId = uuidv4();
  const divider2Id = uuidv4();
  const ethicsId = uuidv4();
  const promptId = uuidv4();
  const termId = uuidv4();
  const historyId = uuidv4();
  const humorId = uuidv4();
  const spacerId = uuidv4();
  const footerId = uuidv4();

  return {
    meta: {
      id: uuidv4(),
      title: 'Neurology AI Pulse',
      issueNumber: '001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    theme: THEMES.northwell,
    rows: [
      { id: uuidv4(), layout: '1col', blockIds: [headerId] },
      { id: uuidv4(), layout: '1col', blockIds: [tickerId] },
      { id: uuidv4(), layout: '1col', blockIds: [divider1Id] },
      { id: uuidv4(), layout: '1col', blockIds: [articleGridId] },
      { id: uuidv4(), layout: '1col', blockIds: [spotlightId] },
      { id: uuidv4(), layout: '1col', blockIds: [divider2Id] },
      { id: uuidv4(), layout: '2col', blockIds: [ethicsId, promptId] },
      { id: uuidv4(), layout: '2col', blockIds: [termId, historyId] },
      { id: uuidv4(), layout: '1col', blockIds: [humorId] },
      { id: uuidv4(), layout: '1col', blockIds: [spacerId] },
      { id: uuidv4(), layout: '1col', blockIds: [footerId] },
    ],
    blocks: {
      [headerId]: {
        id: headerId,
        type: 'header',
        title: 'Neurology AI Pulse',
        subtitle: 'Artificial Intelligence in Clinical Neuroscience',
        issueNumber: 'Issue 001',
        issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        tagline: 'Curated by the Northwell Neurology Department',
      },
      [tickerId]: {
        id: tickerId,
        type: 'ticker',
        items: [
          'FDA approves AI-based EEG seizure detector',
          'GPT-4 achieves neurologist-level stroke triage accuracy',
          'Northwell Neurology AI Research Symposium — March 2025',
          'New NEJM paper: LLMs in neurocritical care documentation',
          "Deep brain stimulation + AI: closed-loop Parkinson's trial results",
        ],
        speed: 'medium',
      },
      [divider1Id]: {
        id: divider1Id,
        type: 'section-divider',
        label: 'TOP STORIES',
        style: 'gradient',
      },
      [articleGridId]: {
        id: articleGridId,
        type: 'article-grid',
        sectionTitle: 'This Week in Neurology AI',
        columns: 2,
        articles: [
          {
            id: uuidv4(),
            title: 'AI Outperforms Radiologists in Detecting Cerebral Microbleeds',
            source: 'Radiology',
            url: 'https://pubs.rsna.org/',
            imageUrl: '',
            summary: 'A deep learning model trained on 12,000 MRI scans detected cerebral microbleeds with 94% sensitivity, outperforming attending neuroradiologists on retrospective review.',
            clinicalReview: 'Clinically relevant for anticoagulation decisions in stroke and dementia workup. Requires prospective validation before bedside deployment.',
            myView: 'This is the kind of AI that could meaningfully change practice — not replacing judgment, but improving the sensitivity of radiologic screening at scale.',
            evidenceLevel: 'Moderate',
            comments: [
              { id: uuidv4(), author: 'Dr. Jai Shahani', role: 'Attending Neurologist', text: 'We should pilot this in our stroke protocol. The false positive rate needs clarification before we roll out.', timestamp: new Date().toISOString() },
            ],
          },
          {
            id: uuidv4(),
            title: 'Large Language Models for Neurology Discharge Summaries',
            source: 'JAMA Network Open',
            url: 'https://jamanetwork.com/',
            imageUrl: '',
            summary: 'GPT-4 generated discharge summaries rated non-inferior to physician-written summaries by blinded reviewers, with significant time savings.',
            clinicalReview: 'Documentation burden is a real problem in neurology. AI-generated drafts with physician review could be a practical near-term solution.',
            myView: 'Quality is approaching acceptable, but liability frameworks and hallucination risk remain unresolved. Not ready for unsupervised use.',
            evidenceLevel: 'Moderate',
            comments: [],
          },
          {
            id: uuidv4(),
            title: 'EEG Foundation Models Generalize Across Clinical Sites',
            source: 'Nature Medicine',
            url: 'https://www.nature.com/nm/',
            imageUrl: '',
            summary: 'A transformer-based EEG model pre-trained on 100,000 recordings showed strong cross-site generalization for seizure detection without site-specific fine-tuning.',
            clinicalReview: 'Cross-site generalizability is the holy grail for EEG AI. This is a meaningful step toward clinical deployment in ICU monitoring.',
            myView: 'EEG is one of the best domains for AI given its volume and the shortage of clinical neurophysiologists. This work is foundational.',
            evidenceLevel: 'High',
            comments: [],
          },
          {
            id: uuidv4(),
            title: 'Federated Learning Preserves Privacy in Multi-Site Stroke Prediction',
            source: 'npj Digital Medicine',
            url: 'https://www.nature.com/npjdigitalmed/',
            imageUrl: '',
            summary: 'A federated learning framework trained on stroke data from 8 centers achieved AUC 0.89 without sharing raw patient data across institutions.',
            clinicalReview: 'Federated learning may be the practical solution to data-sharing obstacles in health system AI. Regulatory clarity is still needed.',
            myView: 'Privacy-preserving AI is not a limitation — it should be the standard. Exciting to see this maturing for neurological applications.',
            evidenceLevel: 'Moderate',
            comments: [],
          },
        ],
      },
      [spotlightId]: {
        id: spotlightId,
        type: 'spotlight',
        title: "Multimodal AI for Parkinson's Disease Monitoring Using Wearables and Speech",
        source: 'Science Translational Medicine',
        url: 'https://www.science.org/journal/stm',
        summary: "Researchers developed a multimodal AI pipeline combining accelerometer data, voice recordings, and digital drawing tasks to continuously monitor Parkinson's disease severity with correlation r=0.87 against UPDRS.",
        clinicalReview: "Remote monitoring of Parkinson's disease is a major unmet need. This multimodal approach is more robust than single-sensor systems and avoids single-point-of-failure limitations.",
        myView: 'The UPDRS correlation is impressive, but the real prize is longitudinal tracking at home. This has implications for medication titration, DBS programming, and clinical trials.',
        evidenceLevel: 'High',
      },
      [divider2Id]: {
        id: divider2Id,
        type: 'section-divider',
        label: 'PERSPECTIVES',
        style: 'gradient',
      },
      [ethicsId]: {
        id: ethicsId,
        type: 'ethics-split',
        topic: 'Algorithmic Bias in Neurology AI: Who Gets Left Behind?',
        issue: 'Most published neurology AI models are trained predominantly on data from academic medical centers in North America and Europe, with known underrepresentation of Black, Hispanic, and rural populations. Stroke risk prediction models may systematically underperform in these populations — with direct harm potential.',
        myView: 'This is not an abstract equity concern. I have seen AI triage tools produce divergent outputs for identical presentations across demographic groups in our own system. Regulatory bodies must require prospective demographic stratification of performance data before clearance.',
      },
      [promptId]: {
        id: promptId,
        type: 'prompt-masterclass',
        title: 'Prompt Masterclass',
        prompt: 'You are a senior neurologist reviewing an EEG report. The following report was generated by an automated AI system. Identify any clinical inconsistencies, flag phrases that may represent hallucinations or system errors, and summarize what clinical action, if any, is warranted. Be explicit about your uncertainty. Report: [PASTE REPORT HERE]',
        explanation: 'This prompt leverages chain-of-thought verification and expert-persona framing to have the LLM audit AI-generated clinical content — a practical use case for AI-on-AI review.',
        useCase: 'EEG AI report QA in clinical neurophysiology labs',
      },
      [termId]: {
        id: termId,
        type: 'term-of-month',
        term: 'Cognitive Sovereignty',
        definition: 'The principle that AI systems in clinical settings must preserve and support — rather than override or erode — the epistemic autonomy and clinical judgment of the practitioner.',
        clinicalContext: 'As AI decision-support tools become embedded in clinical workflows, cognitive sovereignty offers a framework for evaluating when AI assistance crosses into inappropriate automation. It is particularly relevant to alarm fatigue, AI override culture, and medicolegal responsibility.',
      },
      [historyId]: {
        id: historyId,
        type: 'history',
        year: '1973',
        title: 'The First Computerized EEG Analysis',
        content: 'In 1973, Walter and colleagues published one of the first papers demonstrating automated pattern recognition in scalp EEG recordings. Using analog computing systems, they attempted to classify sleep stages without human review — a precursor to the deep learning EEG models of today. The paper attracted both enthusiasm and skepticism from the neurophysiology community, a dynamic that remains remarkably unchanged fifty years later.',
      },
      [humorId]: {
        id: humorId,
        type: 'humor',
        heading: '🧠 Neurology Humor Break',
        content: 'My AI dictation system transcribed "patient denies diplopia" as "patient denies diplopia, but suspects the government." To be fair, given the context of the visit, I cannot entirely rule this out.',
        attribution: '— Submitted anonymously by a Northwell attending',
      },
      [spacerId]: {
        id: spacerId,
        type: 'spacer',
        height: 24,
      },
      [footerId]: {
        id: footerId,
        type: 'footer',
        institution: 'Northwell Health',
        department: 'Department of Neurology',
        unsubscribeUrl: '#',
        websiteUrl: 'https://www.northwell.edu/neurology',
        copyrightYear: new Date().getFullYear().toString(),
        disclaimer: 'This newsletter is for educational purposes only and does not constitute medical advice. Content represents the views of the authors and not Northwell Health as an institution.',
        socials: [
          { platform: 'Twitter/X', url: '#' },
          { platform: 'LinkedIn', url: '#' },
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
  'term-of-month': '📖 Term of the Month',
  'history': '🕰️ History Block',
  'humor': '😄 Humor Block',
  'spacer': '↕️ Spacer',
  'footer': '🔻 Footer',
};
