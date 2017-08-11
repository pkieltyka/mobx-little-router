// @flow
import type { RouteNode } from './RouterStateTree'
import type { Params } from './types'

export class NoMatch {}

export class GuardFailure {
  error: any
  node: RouteNode
  params: Params
  constructor(error: any, node: RouteNode, params: Params) {
    this.error = error
    this.node = node
    this.params = params
  }
}
