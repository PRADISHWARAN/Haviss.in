# Content provenance and editorial decisions

Prepared for the Haviss website build on 14 November 2026.

## Source of truth

The business facts, contact details, required services and page architecture in the user-supplied brief were used as the primary source of truth. Editorial copy has been rewritten, with explanatory technical guidance kept distinct from unverified performance claims.

The following existing Haviss pages were found in indexed web results and reviewed for the factual basis of the content:

| Source | Facts used |
| --- | --- |
| [Haviss home](https://www.haviss.com/) | Service categories, products, Chennai inspection availability, contact addresses and contact details |
| [About Haviss](https://www.haviss.com/about-us.html) | Founded in 2014; business leader H. Sathish Kumar; CMM service and retrofit focus; controller, scale and probing upgrades |
| [CMM services](https://www.haviss.com/cmm-services.html) | Retrofit, software upgrade, calibration, AMC, inspection and training categories |
| [CMM training course](https://www.haviss.com/cmm-training-course.html) | Coordinate systems, probe and stylus selection, qualification, alignment, CAD, programming, GD&T, reporting and maintenance topics |
| [CMM calibration](https://www.haviss.com/cmm-calibration.html) | Calibration service exists; older detailed method statements were not carried forward |
| [CMM contract inspection](https://www.haviss.com/cmm-contract-inspection-service.html) | First article, component, tooling, gauge and fixture inspection service; no live machine capacity or accuracy guarantee was carried forward |
| [Used CMM](https://www.haviss.com/used-cmm.html) | Used CMM business category; no particular machine is treated as current inventory |

The new service and resource explanations are original general guidance about preparing and assessing a requirement. They do not create machine performance guarantees, response commitments, customer references or certification claims.

## Deliberate exclusions

- The legacy calibration pages refer to ISO 10360-2:1994. The new copy does not claim this old edition is the current applicable method, and does not claim ISO/IEC 17025 accreditation. The business must confirm scope, documentation, traceability and applicable methods for each requirement.
- Older manufacturer and software references do not establish current partnerships, authorized-dealer status, software ownership or present compatibility. No such relationships are implied.
- Historical machine ranges, accuracy figures and equipment configurations are not represented as current capacity or stock.
- Current product inventory is intentionally empty until authorized staff publish verified listings. The catalogue gives a professional availability enquiry state.
- Industry cards describe relevant dimensional-metrology applications. They do not assert that Haviss has customers, approvals or sector-specific certifications in each industry.
- Training fees, schedules, durations and certificates are not invented.
- The founder’s year and the business leader’s name are factual. The leadership graphic is typographic; no fictitious staff portrait or biography is used.

## Editable content

Local editorial defaults live in `src/data/content.ts`. `SiteContentProvider` reads published database content when the backend is configured:

- `company` updates phone, email and business addresses; telephone and maps links are derived from the published values.
- `service:<slug>` updates the summary and technical overview for each service.
- `training` updates description and topics.
- Published rows in `products` supply the catalogue and individual product pages.

No private enquiry data is loaded by the public content provider.

## Photography and approvals

See `docs/RESEARCH.md`, the asset provenance document, and `src/data/image-credits.ts` for image sources and licences. Images are illustrative CMM photographs, not evidence of Haviss-owned facilities, machines or customers.

The NIST training image is explicitly captioned as NIST and not a Haviss employee or facility. The modular fixture drawing is a clearly labelled conceptual illustration, not a current product specification. Licensed source attribution is exposed on the website’s image credits page.

Before public business launch, Haviss should review the copy, confirm current services and addresses, approve the proposed visual identity, and supply approved company photography and any inventory photographs/specifications to be published. Business approval is also required before enabling the WhatsApp contact option.

## Privacy notice

The privacy page describes the implemented enquiry and staff-authentication data flow. It does not invent a retention duration, legal certification or unrelated marketing consent. The company should review and approve the notice and document its operational retention procedure before accepting live enquiries.
