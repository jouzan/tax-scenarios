"""Regenerate state data from a locally downloaded Tax Foundation 2026 table."""
from bs4 import BeautifulSoup
import json,re
s=BeautifulSoup(open('/tmp/tax-state-table.html').read(),'html.parser')
result={}
def number(v):
 m=re.search(r'[\d,]+(?:\.\d+)?',v)
 return float(m.group().replace(',','')) if m else 0
for row in s.select('table')[1].select('tr')[1:]:
 c=[x.get_text(' ',strip=True) for x in row.select('td,th')]
 if len(c)!=12: continue
 name=re.sub(r'\s*\(.*','',c[0]).removeprefix('- ').strip()
 if not c[0].startswith('-'):
  result[name]={'single':[],'joint':[],'deduction':[number(c[7]),number(c[8])],'exemption':[number(c[9]),number(c[10]),number(c[11])],'credit':['credit' in c[i] for i in [9,10,11]]}
 if '%' in c[1]:
  result[name]['single'].append([number(c[3]),number(c[1])/100])
  result[name]['joint'].append([number(c[6]),number(c[4])/100])
# Washington taxes capital gains, not the ordinary income modeled here.
result['Washington']['single']=[]
result['Washington']['joint']=[]
open('states.json','w').write(json.dumps(result,separators=(',',':')))
print(len(result),'state jurisdictions parsed')
