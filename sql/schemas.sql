-- posts table
DROP TABLE IF EXISTS guestbook.posts;
CREATE TABLE guestbook.posts (
    id STRING PRIMARY KEY,
    user OBJECT(STRICT) AS (
        name STRING,
        location GEO_POINT
    ),
    text STRING INDEX USING FULLTEXT WITH (analyzer = 'english'),
    created TIMESTAMP,
    image_ref STRING,
    like_count LONG
) WITH (number_of_replicas = '0-2');

-- countries table
DROP TABLE IF EXISTS guestbook.countries;
CREATE TABLE guestbook.countries (
    id STRING PRIMARY KEY,
    name STRING PRIMARY KEY,
    geometry GEO_SHAPE
) WITH (number_of_replicas='0-2');

-- images blob table
DROP BLOB TABLE IF EXISTS guestbook_images;
CREATE BLOB TABLE guestbook_images
WITH (number_of_replicas='0-2');

-- custom text analyzer
CREATE ANALYZER myanalyzer (
  TOKENIZER standard,
  -- TOKENIZER my_edge_ngram WITH (
  --   type='edge_ngram',
  --   min_gram='3',
  --   max_gram='20'
  -- ),
  TOKEN_FILTERS (
    lowercase,
    stop,
    kstem,
    synonym WITH (
      synonyms = [
        'bloomington, iub => iu bloomington',
        'east, iue => iu east',
        'kokomo, iuk => iu kokomo',
        'northwest, gary, iun => iu northwest',
        'south bend, iusb => iu south bend',
        'southeast, ius => iu southeast',
        'indianapolis, iupui => iupu indianapolis',
        'columbus, iupuc => iupu columbus',
        'vr => virtual reality',
        'ar => augmented reality',
        'pano, panorama, panoramic => 360 media',
        'sos => science on a sphere',
        'science visualization, science vis, science viz, data visualization, data vis, data viz, information visualization, information vis, information viz, info visualization, info vis, info viz, vis, viz => visualization',
        'applied mathematics, astronomy, atmospheric science, biochem, biochemistry, bio, biol, biological science, biology, biomolecular science, biotechnology, cellular biochemistry, chem, chemistry, earth science, exploration of energy and matter, forensic science, genomics, geochemistry, geochem, geological science, geol, geology, geoscience, human biology, human life science, hydrology, investigative science, mathematical science, mathematics, math, molecular biochemistry, molecular biology, molecular structure center, neuroscience, paleoanthropology, physics, science, scientific computing and applied mathematics, scientific computing, space science, statistics, volcanology => science and mathematics',
        'engr, tech, biomedical engineering, construction engineering, electrical engineering, engineering, graphics technology, mechanical engineering, mech, motorsports engineering, music and arts technology, technical communication, technology => engineering and technology',
        'soic, cs, biohealth informatics, bioinformatics, computer engineering, computer information systems, computer science, computing, data analytics, data science, human computer interaction, human-computer interaction, computer human interaction, computer-human interaction, informatics, information systems, intelligent systems engineering = informatics and computing',
        'ils, lis, slis, dils, information and library science, information science, library science => library and information science',
        'med, anatomy, anesthesia, cell biology, cellular physiology, dermatology, emergency medicine, family medicine, gynecology, imaging science, immunology, integrative physiology, laboratory medicine, lab medicine, medical genetics, neurological surgery, neurology, obstetrics, ophthalmology, orthopaedic surgery, otolaryngology, pathology, pediatrics, pharmacology, physical medicine, psychiatry, radiation oncology, radiology, surgery, toxicology, urology => medicine',
        'nurs, bsn, family nurse practitioner, lpn, msn, nurse practitioner, rn => nursing',
        'dent, cariology, dental assisting, dental hygiene, endodontics, oral, orthodontics, oral surgery, periodontics => dentistry',
        'opt, business of eye care, vision science => optometry',
        'allied health, applied health science, applied science, audiology, dietetics, disability studies, disability, gerontology, health science, dwyer, vera dwyer, vera z dwyer, medical imaging technology, mental health counseling, nutrition science, occupational therapy, phlebotomy, physical therapy, physician assistant, radiation therapy, radiography, radiological science, rehabilitiation, sonography, speech and hearing science, speech language pathology, sphs, speech => health and rehabilitation science',
        'biostatistics, center for research on health disparities, center for sexual health promotion, community health, environmental health, epidemiology, family health, family studies, health administration, health education, health promotion, human development, indiana prevention resource center, institute for research on addictive behaviors, national center on accessibility, professional health education, public health administration, rural center for aids/std prevention, aids, hiv, std, safety, safety management, sph, kinsey institute, study design and data analysis center, tobacco control and wellness research working group, urban public health, youth development, tobacco, sexual health, sex, family, urban, youth, fairbanks, richard fairbanks, richard m fairbanks => public health',
        'child welfare, sw => social work',
        'animal behavior, anthropology, cognition, cognitive science, communication, communication research, communication studies, concepts and cognition, correctional management, criminal justice, geography, global change, global studies, homeland security, international studies, motorsport studies, ostrom workshop, ostrom, global and international studies, sgis, gis, political and civic engagement, civic engagement, political science, poynter center, psychological and brain science, psychology, public history, schuessler institute, sociology => social science',
        'accounting, applied economics, business, business administration, business analytics, economics, finance, kelley executive partners, kelley, kelley school, leighton, judd leighton, bus, management, marketing, mba, taxation => business and economics',
        'arts management, civic leadership, correctional management, environmental studies, environmental affairs, environmental science, environmental sustainability studies, envirnonmental sustainability, environment, health management, health services management, healthcare management policy, policy studies, public administration, public affairs, public management, public policy, public safety, sustainability studies, sustainable management, spea => public and environmental affairs',
        'paralegal studies, maurer, mckinney, robert mckinney, robert h mckinney => law',
        'arts education, comparative education, counseling, early childhood education, education policy, educational studies, elementary education, higher education, secondary education, special education, student affairs, educ => education',
        "18th century studies, advertising, african american and african diaspora studies, diaspora, african american arts, african american studies, african studies, africana studies, american historians, american indiana studies, american sign language, american studies, apparel merchandising, arabic, art, raclin, ernestine raclin, ernestine m raclin, herron, art history, art therapy, asian american studies, asl, black cinema, black film center, central asian, central asian studies, central eurasian studies, ceramics, chinese, chinese politics and business, chinese politics, cinema and media arts, cinema, classical studies, comparative literature, contemporary antisemitism, contemporary dance, creative advertising, creative arts, creative writing, creole institute, cultural studies, culture, dance, design, dhar india studies, digital humanities, drama, drawing, east asian languages and cultures, east asian, east asian studies, east asian language, eighteenth century studies, english, ethnomusicology, european studies, film studies, fine arts, folklore, folklore and ethnomusicology, french, french and italian, furniture design, game design, gender studies, german, german studies, germanic studies, global media, graphic design, grunwald gallery, hispanic studies, history, history and memory, history and philosophy of sience and medicine, humanities, illustration, inner asian, inner asian and uralic, integrative studio practice, interactive and digital media, digital media, interior design, irish studies, islamic studies, italian, irish, islamic, japanese, jewish studies, jewish, journalism, korean language, korean studies, korean, language sciences, language, latin american and caribbean studies, latin american studies, caribbean studies, latin american, caribbean, latino studies, latino, liberal arts, liberal studies, linguistics, media, media advertising, media management, media studies, media technologies and cultures, medical humanities, medieval studies, middle east, minority studies, modern languages, museum studies, native american studies, native american, near eastern languages and cultures, near eastern languages, near eastern cultures, near eastern, new media, new media art and technology, painting, pan asia, pan asia institute, performing arts, philosophy, photography, polish studies, portuguese, printmaking, public relations, race and ethnicity in society, race, ethnicity, religious studies, russian and east european, russian, east european, sculpture, second language studies, second language, sinor research institute, slavic and east european languages and cultures, slavic, east european, southeast asian studies, southeast asian, spanish, spanish and portuguese, sports journalism, studio art, study of the middle east, theater, theatre, drama and contemporary dance, traditional arts, translation studies, translation, turkish, turkish language, uralic, victorian studies, victorian, visual art, visual communication design, web design, women's and gender studies, women's studies, world language studies, world language => humanitites art and design",
        "mus, all-campus band, all campus band, all-campus chorus, all campus chorus, chorus, all-campus orchestra, all campus orchestra, audio engineering, ballet, band, baroque orhestra, big red basketball band, brass, brass choir, choir, enter for electronic and computer music, center for history of music theory and literature, chamber and collaborative music, chamber music, chamber orchestra, choral conducting, clarinet, choral, chamber, clarinet choir, classical orchestra, composition, computer music, concentus, concert band, concert orchestra, contemporary vocal ensemble, ensemble, orchestra, vocal, crabb band, early music, electronic music, guitar, guitar ensemble, harp, harp ensemble, historical performance institute, history of music, music history, jazz, jazz combos, jazz ensemble, jazz studies, latin american music center, latin american popular music ensemble, marching hundred, marching band, music education, music entrepreneurship, music theory, musicology, new music ensemble, opera, opera choruses, opera studies, orchestral conducting, organ, percussion, percussion ensemble, philharmonic orchestra, piano, singing hoosiers, strings, summer band, symphonic band, symphony orchestra, symphony, trombone, trombone choir, university children's choir, university childrens choir, university chorale, university orhestra, university singers, vocal jazz ensemble, voice, wind ensemble, woodwinds => music",
        'philanthropic studies, lilly family => philanthropy',
        'applied sport science, athletic administration, athletic training, biomechanics, bradford woods, center for physical activity, center for sport policy and conduct, sport policy, center for the science of swimming, science of swimming, community recreation, conventions, eppley institute for parks and public lands, parks and public land, ergonomics, eppley institute, event management, event tourism, exercise physiology, exercise science, fitness, health fitness, hospitality, hospitality and tourism, human ecology, kinesiology, leisure research institute, leisure, motor learning control, nonprofit management, outdoor recreation, park studies, parks, personal training, physical activity, physical education, pe, p e, physical education teacher training, public land, public land management, public recreation, recreation administration, recreational sport management, recreational therapy, sport communication, sport marketing, sport marketing and management, sport management, sport science, sports management, sports science, tourism, tourism studies, tourism conventions and event management, wellness => physical education hospitality and tourism',
        'baseball, basketball, big ten, cheerleading, cross country, cuban center, mark cuban center, field hockey, football, golf, rowing, soccer, softball, swimming, swimming and diving, diving, tennis, track and field, track, volleyball, water polo, wrestling, aikido, badminton, ballroom dance, brazilian jiu jitsu, cricket, cycling, equestrian, fencing, figure skating, gymnastics, hapkido, self defense, self-defense, hoosher bhangra, ice hockey, judo, karate, lacrosse, log rolling, quidditch, rugby, running, sailing, swim, swing dance, tae kwon do, ultimate frisbee, frisbee, waterski, waterboard => athletics'
      ]
    )
  )
);

-- projects table
DROP TABLE IF EXISTS showcase.projects;
CREATE TABLE showcase.projects (
    id STRING INDEX OFF PRIMARY KEY,
    title STRING INDEX USING FULLTEXT WITH (analyzer = 'myanalyzer'),
    description STRING INDEX USING FULLTEXT WITH (analyzer = 'myanalyzer'),
    year STRING,
    url STRING,
    campus_ids ARRAY(INTEGER),
    category_ids ARRAY(INTEGER),
    discipline_ids ARRAY(INTEGER),
    tags ARRAY(STRING),
    image_ref STRING,
    people STRING INDEX USING FULLTEXT WITH (analyzer = 'myanalyzer')
) WITH (number_of_replicas = 0);

-- campuses table
DROP TABLE IF EXISTS showcase.campuses;
CREATE TABLE showcase.campuses (
  id INTEGER,
  name STRING INDEX USING FULLTEXT WITH (analyzer = 'myanalyzer')
) WITH (number_of_replicas = 0);

-- categories table
DROP TABLE IF EXISTS showcase.categories;
CREATE TABLE showcase.categories (
  id INTEGER,
  name STRING INDEX USING FULLTEXT WITH (analyzer = 'myanalyzer')
) WITH (number_of_replicas = 0);

-- disciplines table
DROP TABLE IF EXISTS showcase.disciplines;
CREATE TABLE showcase.disciplines (
  id INTEGER,
  name STRING INDEX USING FULLTEXT WITH (analyzer = 'myanalyzer')
) WITH (number_of_replicas = 0);

-- images blob table
DROP BLOB TABLE IF EXISTS project_images;
CREATE BLOB TABLE project_images
WITH (number_of_replicas = 0);
