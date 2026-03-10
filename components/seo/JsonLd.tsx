interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  name: 'Glid',
  url: 'https://glid-web.vercel.app',
  logo: 'https://glid-web.vercel.app/logo-glid-green.svg',
  description:
    'Glid — платформа для пошуку лікарів, запису на прийом та управління здоров\'ям родини в Україні.',
  areaServed: {
    '@type': 'Country',
    name: 'Ukraine',
  },
  availableLanguage: {
    '@type': 'Language',
    name: 'Ukrainian',
    alternateName: 'uk',
  },
  medicalSpecialty: [
    'GeneralPractice',
    'Pediatrics',
    'Dermatology',
    'Cardiology',
    'Neurology',
    'Gynecology',
    'Ophthalmology',
    'Otolaryngology',
    'Urology',
    'Endocrinology',
    'Dentistry',
    'Gastroenterology',
  ],
  sameAs: [],
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Glid',
  url: 'https://glid-web.vercel.app',
  description:
    'Менше хаосу, більше турботи: здоров\'я родини, лікарі й аналізи — усе в одному місці.',
  inLanguage: 'uk-UA',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://glid-web.vercel.app/likari?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export function createDoctorJsonLd(doctor: {
  name: string
  specialty: string
  image?: string
  url: string
  description?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    medicalSpecialty: doctor.specialty,
    image: doctor.image,
    url: doctor.url,
    description: doctor.description,
    areaServed: {
      '@type': 'Country',
      name: 'Ukraine',
    },
  }
}

export function createClinicJsonLd(clinic: {
  name: string
  address?: string
  image?: string
  url: string
  description?: string
  phone?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: clinic.name,
    address: clinic.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: clinic.address,
          addressCountry: 'UA',
        }
      : undefined,
    image: clinic.image,
    url: clinic.url,
    description: clinic.description,
    telephone: clinic.phone,
  }
}
