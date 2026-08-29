import chrome145Fixture from './fixtures/chrome-145-profile.json' with { type: 'json' };

export type ImportProfileId = 'generic' | 'chrome-145';
export type GuidanceTone = 'danger' | 'safe';

export interface ImportProfile {
  id: ImportProfileId;
  label: string;
  version: string;
  verifiedOn?: string;
  folderCollision: {
    severity: 'high' | 'low';
    tone: GuidanceTone;
    status: string;
    explanation: string;
    checklist: string;
  };
}

const chromeKeepsFullPath = chrome145Fixture.folderRule === 'preserves-full-path';

export const IMPORT_PROFILES: readonly ImportProfile[] = [
  {
    id: 'generic',
    label: 'Generic audit',
    version: '1',
    folderCollision: {
      severity: 'high',
      tone: 'danger',
      status: 'Review paths',
      explanation: 'Review same-named folders before import. The corrected copy gives each one a distinct name.',
      checklist: 'Confirm every same-named folder after importing the corrected copy.'
    }
  },
  {
    id: 'chrome-145',
    label: chrome145Fixture.label,
    version: chrome145Fixture.version,
    verifiedOn: chrome145Fixture.verifiedOn,
    folderCollision: {
      severity: chromeKeepsFullPath ? 'low' : 'high',
      tone: chromeKeepsFullPath ? 'safe' : 'danger',
      status: chromeKeepsFullPath ? 'Lower risk' : 'Review paths',
      explanation: chromeKeepsFullPath
        ? 'The local Chrome 145 fixture keeps these full folder paths separate. Confirm them after import.'
        : 'Review same-named folders before import. The corrected copy gives each one a distinct name.',
      checklist: chromeKeepsFullPath
        ? 'Confirm both same-named folder paths after importing into Chrome 145.'
        : 'Confirm every same-named folder after importing the corrected copy.'
    }
  }
];

export function importProfile(id?: string): ImportProfile {
  return IMPORT_PROFILES.find((profile) => profile.id === id) ?? IMPORT_PROFILES[0];
}
