import sys, os
sys.path.insert(0, os.path.abspath('.'))
from backend.services.rag.retriever import RAGRetriever
r = RAGRetriever()
q = 'What are the anticipated supply chain disruptions and historical risks for road transport experiencing heavy rain weather with a high risk level? What are common mitigation or rerouting strategies?'
res = r.retrieve(q, top_k=5)
for x in res:
    print(round(x['score'], 4), x['source'])
