import sys
import os
sys.path.insert(0, os.path.abspath('.'))
from backend.services.rag.retriever import RAGRetriever

retriever = RAGRetriever()

queries = [
    'What weather-related disruptions could affect this shipment?',
    'What alternative transport options are available when roads are disrupted?',
    'How can trade sanctions and regional conflicts affect shipping routes?',
    'Why is carrier reliability important for on-time delivery?',
    'How can supply-chain resilience reduce disruption impacts?',
    'What is the best programming language for developing a mobile game?'
]

for q in queries:
    res = retriever.retrieve(q, top_k=5)
    print('-------------------------')
    print('Query:', q)
    for r in res:
        print(f"  Score: {r['score']:.4f} - {r['source']}")
