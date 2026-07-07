const PROTOPEDIA_PROTOTYPE_BASE_URL = 'https://protopedia.net/prototype';
export const buildPrototypeLink = (prototypeId: number): string => {
  return `${PROTOPEDIA_PROTOTYPE_BASE_URL}/${prototypeId}`;
};

const PROTOPEDIA_TAG_BASE_URL = 'https://protopedia.net/tag';
export const buildTagLink = (tag: string): string => {
  const url = new URL(PROTOPEDIA_TAG_BASE_URL);
  url.searchParams.set('tag', tag);
  return url.toString();
};

const PROTOPEDIA_MATERIAL_BASE_URL = 'https://protopedia.net/material';
export const buildMaterialLink = (material: string): string => {
  return `${PROTOPEDIA_MATERIAL_BASE_URL}/${encodeURIComponent(material)}`;
};

const PROTOPEDIA_PROTOTYPER_BASE_URL = 'https://protopedia.net/prototyper';
export const buildUserLink = (profileId: string): string | null => {
  if (profileId === '') return null;
  return `${PROTOPEDIA_PROTOTYPER_BASE_URL}/${encodeURIComponent(profileId)}`;
};
