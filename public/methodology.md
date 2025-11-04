**Welcome to sust*AI*d**, an AI-based, design-driven tool with the aim
to assist fashion designers in the process of sustainable material
selection, combining artificial intelligence, to provide informed,
data-driven recommendations that support conscious material choices,
with design-oriented thinking in the design process.

How it started

The tool, initially developed as part of a master's thesis at
Politecnico di Milano, has been designed to **make sustainable material
selection more accessible, understandable, and actionable to fashion
designers.** Through its curated material database and AI assistant,
sust*AI*d provide guidance, insights, and recommendations that help
designers make informed decisions.

Vision

*"Transforming the material selection process for fashion design into an
interconnected and responsible ecosystem where design and sustainability
coexist."*

*sustAId* envisions a **future** where designers -- empowered by AI
assistance and data-driven insights -- can make conscious material
choices that respect environmental and social sustainability, respect
policies and regulations, promote material innovation, and where
**design decisions become catalysts for advancing the sustainable
transition of the fashion industry.**

Mission

sust*AI*d's mission is to **bridge the still present gap between
sustainable development goals and fashion design practices**, by
supporting fashion designers navigating the complexity of sustainable
material selection through accessible, transparent, and grounded
insights.

Rooted in a design-driven methodology, the tool translates complex
sustainability data into actionable guidance, tailored for fashion
designers' creative and functional needs. Through this approach
sust*AI*d wants to:

-   Democratise access to credible and transparent sustainability data.

-   Enhance the integration of sustainability criteria into the early
    design phases where material choices have the highest impact.

-   Fostering dialogue between design, responsible materials, and
    technology.

-   Promote the adoption of next-generation and preferred materials

-   Encouraging collaboration and interconnectivity between the
    different stakeholders of the sector.

Ultimately, is fundamental to know that **sust*AI*d does not aspire to
substitute human designers** but aspires to be at the same time a
creative partner and a knowledge ecosystem.

Data collection methodology

This section describes the approach and methodology behind sust*A*Id

The **sust*AI*d database** was created to overcome the limitation of
users, like students or emerging fashion designers, who may not have a
material portfolio to upload on the platform, but wish to explore fibres
and materials, gaining a complete overview on the textile landscape.

This directly integrated database, has been developed with the support
of the custom trained **sust*AI*d GPT collecting free open data from
selected sources**. Using only open data, though, the work of the GPT
was not always satisfactory manual intervention by the developer was
necessary to standardize discrepancies, correct errors, and clearly
define each row = material and column = property, to help the AI in
generating a complete, consistent, and readable database. All the
retrieved data was source-verified by the developer and not fabricated,
missing or incomplete records are signaled with N/A.

The update of the database is a responsibility of the developer who will
periodically (approximately every 3 or 6 month) instruct the GPT to
repeat the research to update some data, or identify new materials
missing in the current list, and will check the results to prevent
unwanted errors or discrepancies.

1.  Data sources

sust*AI*d GPT combines **three different layers of knowledge** -- static
knowledge (until June 2024), developer-provided and attached documents,
web and real-time data -- when working. Because the information
contained into these three layers of knowledge come from different
sources, sust*AI*d follows a hierarchy of data sources -- ranked by
reliability and temporal relevance in the table below -- when executing
its workflow. When sources conflict with each other, the GPT prioritizes
the most recent and methodologically robust, explicitly stating the
motivation for doing so to the user.

  ------------------------------------------------------------------------------
  **Level**   **Source Type**   **Examples**                **Reliability
                                                            Criteria**
  ----------- ----------------- --------------------------- --------------------
  A           User-provided     LCA_data_v2.csv, Textile    Direct, traceable,
              files             Exchange reports,           quantitative data
                                scientific literature       

  B           Institutional     Materials Market Report     Peer-reviewed,
              reports           2024--2025, Ensuring        methodologically
                                Integrity in the Use of LCA documented
                                Data (2025), etc.           

  C           Pre-2024 general  ISO 14040--44 standards,    Valid theoretical
              knowledge         GHG Protocol, academic      background
                                references, valid           
                                theoretical background,     
                                etc.                        

  D           Real-time web     Textile Exchange, UNEP,     Used for updates or
              research          ISO, FAO                    verification
  ------------------------------------------------------------------------------

2.  Textile materials and fibres information

Because data on fibres from individual manufacturers are generally
difficult to obtain -- particularly for free -- and following Textile
Exchange's Materials Market Reports approach, the **entries listed refer
to the fibre family rather than a specific producer**, except for
registered materials such as Circulose® (e.g., The entry SUTAID_017,
listed as Cotton, does not refer to a specific cotton fibre from a
particular manufacturer produced under specific conditions, but rather
to the generic family of cotton fibres sharing similar characteristics
due to their common raw material origin).

It is for this same reason that many properties were not assessed with
just one number, but the result will be either a range or a qualitative
evaluation.

To provide homogeneous consistent naming, the developer defined the
**categories in which textile materials and fibres should be
clustered.**

-   Bio-constructed Material

-   Biosynthetic Fibre

-   Man-made Cellulosic Fibre

-   Man-made Protein Fibre

-   Natural Animal Fibre

-   Natural Plant Fibre

-   Natural Polymer

-   Next-gen Recycled Fibre

-   Non-fibre Material

-   Recycled MMCF

-   Recycled Natural Animal Fibre

-   Recycled Natural Plant Fibre

-   Recycled Synthetic Fibre

-   Synthetic Fibre

-   Synthetic polymer

> Presented below is the list of materials comprised in the database (in
> alphabetic order) -- each of one is preceded by its material ID, for
> easier classification and readability of the database, and the
> category in which it belongs.

  -------------------------------------------------------------------------
  **Material    **Material name**             **Material Categories**
  ID**                                        
  ------------- ----------------------------- -----------------------------
  SUSTAID_001   Acetate                       Man-Made Cellulosic Fibre

  SUSTAID_002   Acrylic                       Synthetic Fibre

  SUSTAID_003   Alpaca                        Natural Animal Fibre

  SUSTAID_004   Angora (Rabbit)               Natural Animal Fibre

  SUSTAID_005   Bamboo Viscose                Man-Made Cellulosic Fibre

  SUSTAID_006   Banana Fibre                  Natural Plant Fibre

  SUSTAID_007   Bio-based TPU                 Biosynthetic Fibre

  SUSTAID_008   Biofabricated Cellulose       Man-Made Cellulosic Fibre

  SUSTAID_009   Biofabricated Spider Silk     Man-Made Protein Fibre

  SUSTAID_010   Bio-PA                        Biosynthetic Fibre

  SUSTAID_011   Bio-PET                       Biosynthetic Fibre

  SUSTAID_012   Bio-PTT                       Biosynthetic Fibre

  SUSTAID_013   Camel Hair                    Natural Animal Fibre

  SUSTAID_014   Casein fibre                  Man-Made Protein Fibre

  SUSTAID_015   Cashmere                      Natural Animal Fibre

  SUSTAID_016   Circulose®                    Man-Made Cellulosic Fibre

  SUSTAID_017   Cotton                        Natural Plant Fibre

  SUSTAID_018   Cupro                         Man-Made Cellulosic Fibre

  SUSTAID_019   Down (Feathers)               Non-Fibre Material

  SUSTAID_020   Elastane/Spandex              Synthetic Fibre

  SUSTAID_021   Hemp                          Natural Plant Fibre

  SUSTAID_022   Jute                          Natural Plant Fibre

  SUSTAID_023   Kapok                         Natural Plant Fibre

  SUSTAID_024   Keratin fibre                 Man-Made Protein Fibre

  SUSTAID_025   Leather                       Non-Fibre Material

  SUSTAID_026   Linen (Flax)                  Natural Plant Fibre

  SUSTAID_027   Manila Hemp (Abaca)           Natural Plant Fibre

  SUSTAID_028   Merino Wool                   Natural Animal Fibre

  SUSTAID_029   Modal                         Man-Made Cellulosic Fibre

  SUSTAID_030   Mohair                        Natural Animal Fibre

  SUSTAID_031   Mulberry Silk                 Natural Animal Fibre

  SUSTAID_032   Mycelium                      Bio-constructed Material

  SUSTAID_033   Natural Rubber                Natural Polymer

  SUSTAID_034   Nylon/Polyamide               Synthetic Fibre

  SUSTAID_035   Orange Fibre                  Man-Made Cellulosic Fibre

  SUSTAID_036   Organic Cotton                Natural Plant Fibre

  SUSTAID_037   PHA (Polyhydroxyalkanoates)   Biosynthetic Fibre

  SUSTAID_038   Piña (Pineapple)              Natural Plant Fibre

  SUSTAID_039   Polyester                     Synthetic Fibre

  SUSTAID_040   Polyester Microfiber          Synthetic Fibre

  SUSTAID_041   Ramie                         Natural Plant Fibre

  SUSTAID_042   Rayon/Viscose                 Man-Made Cellulosic Fibre

  SUSTAID_043   Recycled Cotton               Recycled Natural Plant Fibre

  SUSTAID_044   Recycled Cotton (Chemical     Recycled Natural Plant Fibre

  SUSTAID_045   Recycled Cotton (Mechanical)  Recycled Natural Plant Fibre

  SUSTAID_046   Recycled Nylon                Recycled Synthetic Fibre

  SUSTAID_047   Recycled Polyester            Recycled Synthetic Fibre

  SUSTAID_048   Recycled wool                 Recycled Natural Animal Fibre

  SUSTAID_049   Refibra                       Recycled MMCF

  SUSTAID_050   Sisal                         Natural Plant Fibre

  SUSTAID_051   Synthetic rubber              Synthetic Polymer

  SUSTAID_052   T2T (Textile-to-textile)      Next-gen Recycled Fibre
                recycled MMCF                 

  SUSTAID_053   T2T (Textile-to-textile)      Next-gen Recycled Fibre
                recycled PA                   

  SUSTAID_054   T2T (Textile-to-textile)      Next-gen Recycled Fibre
                recycled PET                  

  SUSTAID_055   Tencel Lyocell                Man-Made Cellulosic Fibre

  SUSTAID_056   Tencel Modal                  Man-Made Cellulosic Fibre

  SUSTAID_057   TPU                           Synthetic Fibre

  SUSTAID_058   Vicuña                        Natural Animal Fibre

  SUSTAID_059   Vinyl                         Synthetic Fibre

  SUSTAID_060   Viscose                       Man-Made Cellulosic Fibre

  SUSTAID_061   Wild Silk (Tussah)            Natural Animal Fibre

  SUSTAID_062   Wool                          Natural Animal Fibre
  -------------------------------------------------------------------------

3.  Assessment framework and explanation

To overcome the discrepancy errors in the how the GPT searched for data
on each material's properties and information, the developer defined,
the **list of required information to be included, along with an
explanation**. For some properties that needed to be updated to ensure
alignment with a design-oriented thinking and methodology, a "*new*"
definition was provided.

Since it is more difficult to access open quantitative data for some
families of fibres and because it is an easier language for designers,
**qualitative evaluation has been preferred over quantitative in
assessing some of the following categories**. Qualitative evaluation, as
one can read in the list of characteristics, is assessed with a score
from 1 to 6 (corresponding to the scale *low*, *medium-low*, *medium*,
*medium-high*, *high*, and *very high).*

Here the complete list of properties and how they were assesses:

  -----------------------------------------------------------------------
  **Sustainability rating** -- Qualitative assessment of how sustainable
  the material is comprehensively across multiple sustainability and
  performance categories. The qualitative evaluation is, in this case,
  obtained with the average between the evaluation of environmental
  sustainability, social sustainability, governance, and durability.
  Materials should be rated *low*, *medium-low*, *medium*, *medium-high*,
  *high*, and *very high* based on the results.
  -----------------------------------------------------------------------
  **Sustainability score **-- Quantitative assessment corresponding to
  the *sustainability score.* Materials should be rated from 1 to 6, with
  *low* corresponding to 1/6, *medium*-*low* to 2/6, *medium* to 3/6,
  *medium-high* to 4/6, *high* to 5/6, and *very high* to 6/6.

  **Environmental sustainability** -- Qualitative evaluation representing
  the material's impact on the environment throughout its lifecycle. In
  this context, the evaluation is obtained with the average between the
  values of Ghg emissions, water consumption, energy use, chemical use,
  fossil fuel consumption, and toxicity. Since some of these values are
  quantitative and expressed with numbers, the AI assistant translates
  them to qualitative evaluations. Materials should be rated *low* (1/6),
  *medium-low* (2/6), *medium* (3/6), *medium-high* (4/6), *high* (5/6),
  and *very high* (6/6).

  **Ghg emissions** -- Greenhouse gas emissions produced per kilogram of
  material. Quantitative data expressed in kg CO2e/Kg.

  **Water consumption** -- Liters of water used to produce one kilogram
  of the material. Quantitative data expressed in L/Kg

  **Energy use** -- Megajoules of energy required to produce one kilogram
  of material. Quantitative data expressed in MJ/Kg

  **Land use** -- Amount of land required to produce the material,
  usually expressed in Kg/ha, but in this context made qualitative in
  this context for easier data retrieving and understanding. Materials
  should be rated *low* (1/6), *medium-low* (2/6), *medium* (3/6),
  *medium-high* (4/6), *high* (5/6), and *very high* (6/6).

  **Chemical use level** -- The quantity or intensity of chemicals used
  in the production of the material. Qualitative evaluation for easier
  data retrieving and understanding. Materials should be rated *low*
  (1/6), *medium-low* (2/6), *medium* (3/6), *medium-high* (4/6), *high*
  (5/6), and *very high* (6/6).

  **Fossil fuel consumption** -- Amount of fuel required to produce
  and/or transport the material. Qualitative evaluation for easier data
  retrieving and understanding. Materials should be rated *low* (1/6),
  *medium-low* (2/6), *medium* (3/6), *medium-high* (4/6), *high* (5/6),
  and *very high* (6/6).

  **Toxicity** -- Potential of the material to cause harm to humans or
  ecosystems. Qualitative evaluation for easier data retrieving and
  understanding. Materials should be rated *low* (1/6), *medium-low*
  (2/6), *medium* (3/6), *medium-high* (4/6), *high* (5/6), and *very
  high* (6/6).

  **Biodegradability** -- The materials' ability (full, partial, none) to
  naturally decompose in the environment. Qualitative evaluation for
  easier data retrieving and understanding. Materials should be rated
  *low* (1/6), *medium-low* (2/6), *medium* (3/6), *medium-high* (4/6),
  *high* (5/6), and *very high* (6/6).

  **Social sustainability **-- Qualitative evaluation that refers to
  practices and policies that support human wellbeing, equity, and social
  cohesion for both current and future generations. At its core, it\'s
  about creating systems and communities where people can thrive together
  over the long term. Materials should be rated *low* (1/6), *medium-low*
  (2/6), *medium* (3/6), *medium-high* (4/6), *high* (5/6), and *very
  high* (6/6).

  **Governance** -- Qualitative evaluation that in fashion materials
  ensures that sustainability commitments (like transparency and
  traceability or policy and regulations compliance) aren\'t just
  aspirational statements but are backed by concrete systems that create
  accountability and drive real change in how fibres are grown,
  processed, and used. Materials should be rated *low* (1/6),
  *medium-low* (2/6), *medium* (3/6), *medium-high* (4/6), *high* (5/6),
  and *very high* (6/6).

  **Durability** -- Qualitative evaluation that refers to the material's
  resistance to wear, tear, or degradation with time. In the context of
  sustainable development, durability -- that can be also emotional, but
  that unfortunately is unmeasurable -- is fundamental because it reduces
  over consumption and extends the lifespan of garments. In this case is
  obtained with the average between the values of the properties that
  influence the performance of a fibre or material, when used to make a
  garment: abrasion resistance, chemical resistance, tensile strength,
  temperature resistance. Since some of these values are quantitative and
  expressed with numbers, the AI assistant translates them to qualitative
  evaluations. Materials should be rated *low* (1/6), *medium-low* (2/6),
  *medium* (3/6), *medium-high* (4/6), *high* (5/6), and *very high*
  (6/6).

  **Tensile strength** -- Maximum stress the material can withstand while
  being stretched. Quantitative data expressed in MPa.

  **Abrasion resistance** -- The material's ability to resist surface
  wear from friction. Qualitative evaluation for easier data retrieving
  and understanding. Materials should be rated *low* (1/6), *medium-low*
  (2/6), *medium* (3/6), *medium-high* (4/6), *high* (5/6), and *very
  high* (6/6).

  **Chemical resistance** -- How well the material withstands exposure to
  chemicals without degrading. Qualitative evaluation for easier data
  retrieving and understanding. Materials should be rated *low* (1/6),
  *medium-low* (2/6), *medium* (3/6), *medium-high* (4/6), *high* (5/6),
  and *very high* (6/6).

  **Moisture absorption** -- The material capacity to absorb and retain
  moisture. Qualitative evaluation for easier data retrieving and
  understanding, materials should be rated *low* (1/6), *medium-low*
  (2/6), *medium* (3/6), *medium-high* (4/6), *high* (5/6), and *very
  high* (6/6), along with quantitative assessment expressed in
  percentage.

  **Temperature resistance** -- The range of temperatures the material
  can endure without damage. Quantitative data range expressed in °C.

  **Elasticity** -- Ability of the material to return to its original
  shape after stretching or deformation. Qualitative evaluation for
  easier data retrieving and understanding, materials should be rated
  *low* (1/6), *medium-low* (2/6), *medium* (3/6), *medium-high* (4/6),
  *high* (5/6), and *very high* (6/6), along with quantitative assessment
  expressed in percentage.

  **Dyeability** -- Ease with which the material can be dyed or colored.
  Qualitative evaluation for easier data retrieving and understanding,
  materials should be rated *low* (1/6), *medium-low* (2/6), *medium*
  (3/6), *medium-high* (4/6), *high* (5/6), and *very high* (6/6), along
  with quantitative assessment expressed in percentage.

  **Comfort level** -- Qualitative assessment of how comfortable the
  material feels to wear. Evaluation through little explicative sentences
  for easier understanding when asking the AI assistant suggestions.

  **Cost range** -- Typical range price of the material per unit.
  Quantitative range data usually expressed in \$/Kg.

  **Cost volatility** -- How much the material price fluctuates over
  time. Qualitative evaluation where materials should be rated *low*
  (1/6), *medium-low* (2/6), *medium* (3/6), *medium-high* (4/6), *high*
  (5/6), and *very high* (6/6), along with quantitative assessment
  expressed in percentage.

  **Primary applications** -- Primary and more usual applications of a
  material in the fashion and textile industry. Evaluation through little
  explicative sentences for easier understanding when asking the AI
  assistant suggestions.

  **Main challenges** -- Main sustainability challenges the materials
  undergoes. Evaluation through little explicative sentences for easier
  understanding when asking the AI assistant suggestions.

  **Key opportunities** -- Main opportunities the material offers with
  its use. Evaluation through little explicative sentences for easier
  understanding when asking the AI assistant suggestions.
  -----------------------------------------------------------------------

Technical Information

Framework: React 19 + Tauri 2

Database: Supabase (cloud)

Charts: Recharts

AI: OpenAI (GPT) / Anthropic Claude

Support

Thank you for using sust*AI*d and contributing to the development on the
integration of AI into sustainable material selection for fashion
design.

For information about the tool and the data collection methodology,
questions, or issues, please contact: <alessia.vittori@mail.polimi.it>
