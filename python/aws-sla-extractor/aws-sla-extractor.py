from lxml import html
from lxml.html import fromstring
import yaml,html2text,requests, re, boto3, json


with open(r'sla-sources.yaml') as file:
    # The FullLoader parameter handles the conversion from YAML
    # scalar values to Python the dictionary format
    sources = yaml.load(file, Loader=yaml.FullLoader)

    #print(sources)

    for source in sources:
        #print('getting sla from '+source)
        page = requests.get(source)
        parser = html2text.HTML2Text()
        parser.ignore_links = True

        start = parser.handle(page.text).find("AWS will") + len("AWS will")
        end = parser.handle(page.text).find("Service Credits") + len("Service Credits")

        sla_text = substring = parser.handle(page.text)[start:end]
        #print(sla_text)
        comprehend = boto3.client(service_name='comprehend', region_name='us-east-1')
        #print('Calling DetectEntities')
        #print(json.dumps(comprehend.detect_entities(Text=sla_text, LanguageCode='en'), sort_keys=True, indent=4))
        #print('End of DetectEntities\n')

        sla_entities=comprehend.detect_entities(Text=sla_text.rstrip('\n'), LanguageCode='en')['Entities']

        #print(sla_entities)
        service_name=fromstring(page.content).findtext('.//title')
        service_sla=""
        entity=""

        for entity in sla_entities:

            if(entity['Type']=='QUANTITY' and "%" in entity['Text']):
                service_sla=entity['Text']
            if(service_sla!=""):
                break
        if (service_sla==""):
            service_sla="SLA missing on page"
        print(service_name+": "+service_sla)


