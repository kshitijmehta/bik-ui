enum HttpRequest {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH"
};


enum HttpStatusCode {
  OK = 200,
  ACCEPTED = 202,
  PARTIAL_INFO = 203,
  BAD_REQUEST = 400,
  NOT_FOUND = 404
}

export { HttpRequest, HttpStatusCode };