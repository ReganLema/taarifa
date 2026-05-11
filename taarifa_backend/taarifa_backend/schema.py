

import graphene
import core.schema

class Query(core.schema.Query, graphene.ObjectType):
    # This inherits all queries from core.schema.Query
    hello = graphene.String()

    def resolve_hello(self, info):
        return "Hello from Taarifa Salary Guide!"

class Mutation(graphene.ObjectType):
    ping = graphene.String()
    
    def resolve_ping(self, info):
        return "pong"

schema = graphene.Schema(query=Query, mutation=Mutation)